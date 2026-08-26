import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { PaymentsService } from './payments.service';

// Flutterwave calls this directly — it can't carry our session cookies, so
// it must be public. Trust is established entirely via the signature check
// below, not via the AuthGuard.
@AllowAnonymous()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('flutterwave-signature') signature: string | undefined,
  ) {
    if (!req.rawBody) {
      throw new BadRequestException('Missing raw request body');
    }

    const isValid = this.paymentsService.verifyWebhookSignature(
      req.rawBody.toString('utf8'),
      signature,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    await this.paymentsService.handleWebhookEvent(
      req.body as {
        type?: string;
        data?: { reference?: string; status?: string };
      },
    );
    return { received: true };
  }
}
