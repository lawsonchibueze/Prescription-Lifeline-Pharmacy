import { Injectable, Logger } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Thin wrapper around Flutterwave's API.
 *
 * IMPORTANT — read before touching checkout initialization:
 * Flutterwave's current API (confirmed live against developer.flutterwave.com
 * in Aug 2026) authenticates via OAuth2 client-credentials, not the classic
 * secret-key Bearer token most tutorials still show. Its documented
 * Customers → Payment Methods → Orders/Charges flow requires the *merchant*
 * to already hold a `payment_method_id` (raw card details encrypted
 * client-side, or a stored bank/mobile-money method) — there is no
 * "redirect the customer to a Flutterwave-hosted page and let them pick how
 * to pay" endpoint documented there. Their e-commerce marketing page still
 * points merchants at "Flutterwave Inline" for exactly that hosted-checkout
 * experience, but no technical reference for Inline was reachable at the
 * time this was written.
 *
 * Net effect: `initializeCheckout()` below is deliberately left unimplemented
 * (see PaymentsService) until we have a real sandbox account and can see
 * which checkout product the dashboard actually issues keys for. Everything
 * else here — OAuth2 token handling and webhook signature verification — is
 * implemented against Flutterwave's confirmed current docs and is safe to
 * use regardless of which checkout product ends up being wired in.
 */
@Injectable()
export class FlutterwaveClient {
  private readonly logger = new Logger(FlutterwaveClient.name);
  private readonly tokenUrl =
    'https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token';

  private cachedToken: { value: string; expiresAt: number } | null = null;

  async getAccessToken(): Promise<string> {
    if (this.cachedToken && this.cachedToken.expiresAt > Date.now() + 30_000) {
      return this.cachedToken.value;
    }

    const clientId = process.env.FLUTTERWAVE_CLIENT_ID;
    const clientSecret = process.env.FLUTTERWAVE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      throw new Error(
        'FLUTTERWAVE_CLIENT_ID / FLUTTERWAVE_CLIENT_SECRET are not set — add them to apps/api/.env',
      );
    }

    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Flutterwave token request failed (${response.status}): ${body}`,
      );
    }

    const json = (await response.json()) as {
      access_token: string;
      expires_in: number;
    };
    this.cachedToken = {
      value: json.access_token,
      expiresAt: Date.now() + json.expires_in * 1000,
    };
    return json.access_token;
  }

  /**
   * Verifies the `flutterwave-signature` header Flutterwave sends on every
   * webhook call: HMAC-SHA256 of the raw request body, keyed with the
   * secret hash configured in the Flutterwave dashboard, base64-encoded.
   * Uses a timing-safe comparison to avoid leaking the expected value via
   * response-time differences.
   */
  verifyWebhookSignature(
    rawBody: string,
    signatureHeader: string | undefined,
  ): boolean {
    const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH;
    if (!secretHash || !signatureHeader) {
      return false;
    }

    const expected = createHmac('sha256', secretHash)
      .update(rawBody)
      .digest('base64');
    const expectedBuf = Buffer.from(expected);
    const actualBuf = Buffer.from(signatureHeader);

    if (expectedBuf.length !== actualBuf.length) {
      return false;
    }
    return timingSafeEqual(expectedBuf, actualBuf);
  }

  // See the class-level comment: intentionally not implemented yet. Returns
  // a rejected promise (rather than throwing synchronously) since a real
  // implementation will need to await HTTP calls here.
  initializeCheckout(): Promise<never> {
    this.logger.warn(
      'FlutterwaveClient.initializeCheckout() called but is not implemented yet.',
    );
    return Promise.reject(
      new Error(
        'Flutterwave checkout initialization is not wired up yet — see the comment at the ' +
          'top of flutterwave.client.ts for why, and what is needed to finish it.',
      ),
    );
  }
}
