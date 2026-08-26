import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { FlutterwaveClient } from './flutterwave.client';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, FlutterwaveClient],
  exports: [PaymentsService],
})
export class PaymentsModule {}
