import { Controller, Get } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Public health check — everything else is protected by default once
  // AuthModule registers its global AuthGuard (see app.module.ts). Public
  // catalog endpoints added in Phase 3 will need this same decorator.
  @AllowAnonymous()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
