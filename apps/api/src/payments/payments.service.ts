import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FlutterwaveClient } from './flutterwave.client';

const SUCCESS_STATUSES = new Set(['succeeded', 'successful', 'completed']);

export interface CheckoutInitResult {
  ok: boolean;
  checkoutUrl?: string;
  reason?: string;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly flutterwave: FlutterwaveClient,
  ) {}

  /**
   * Best-effort: Flutterwave checkout initialization isn't wired up yet
   * (see FlutterwaveClient). This never throws — order creation should
   * still succeed and leave the order PENDING even when payment can't be
   * started yet, rather than failing the whole checkout request.
   */
  async initializeCheckoutForOrder(): Promise<CheckoutInitResult> {
    try {
      await this.flutterwave.initializeCheckout();
      // Unreachable until initializeCheckout() is implemented for real.
      return { ok: true };
    } catch (error) {
      this.logger.warn(
        `Checkout initialization skipped: ${(error as Error).message}`,
      );
      return { ok: false, reason: (error as Error).message };
    }
  }

  verifyWebhookSignature(
    rawBody: string,
    signatureHeader: string | undefined,
  ): boolean {
    return this.flutterwave.verifyWebhookSignature(rawBody, signatureHeader);
  }

  /**
   * Applies a verified webhook event to our own Order record. Matches on
   * Order.paymentReference, which we set to the tx_ref/reference we hand
   * Flutterwave when initializing a payment.
   */
  async handleWebhookEvent(payload: {
    type?: string;
    data?: { reference?: string; status?: string };
  }) {
    const reference = payload.data?.reference;
    const status = payload.data?.status;
    if (!reference) {
      this.logger.warn(
        `Webhook event missing data.reference: ${JSON.stringify(payload)}`,
      );
      return;
    }

    const order = await this.prisma.order.findUnique({
      where: { paymentReference: reference },
    });
    if (!order) {
      this.logger.warn(
        `Webhook event for unknown paymentReference: ${reference}`,
      );
      return;
    }

    if (status && SUCCESS_STATUSES.has(status)) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAID' },
      });
      this.logger.log(
        `Order ${order.id} marked PAID via webhook (${reference})`,
      );
    } else {
      this.logger.log(
        `Webhook for order ${order.id} reported status "${status}" — no change`,
      );
    }
  }
}
