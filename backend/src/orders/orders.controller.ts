import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch, ParseIntPipe, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(createOrderDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('my-orders')
  findMyOrders(@Request() req) {
    return this.ordersService.findByUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  updateOrder(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() updateDto: UpdateOrderDto,
    @Req() req: any
  ) {
    const userId = req.user.userId;
    return this.ordersService.updateOrder(orderId, updateDto, userId);
  }
}