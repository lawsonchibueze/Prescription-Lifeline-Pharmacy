import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

// No @AllowAnonymous() here on purpose — every route needs a signed-in
// customer, enforced by the global AuthGuard (see app.module.ts).
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Session() session: UserSession, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(session.user.id, dto);
  }

  @Get()
  findMine(@Session() session: UserSession) {
    return this.ordersService.findMine(session.user.id);
  }

  @Get(':id')
  findOne(@Session() session: UserSession, @Param('id') id: string) {
    return this.ordersService.findMineById(session.user.id, id);
  }
}
