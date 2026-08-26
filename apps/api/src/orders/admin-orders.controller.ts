import { Controller, Get, Param } from '@nestjs/common';
import { Roles } from '@thallesp/nestjs-better-auth';
import { OrdersService } from './orders.service';

@Roles(['admin'])
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOneAdmin(id);
  }
}
