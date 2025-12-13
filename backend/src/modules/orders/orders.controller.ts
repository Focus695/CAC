import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, UpdatePaymentStatusDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get user orders' })
  getUserOrders(@Request() req: any, @Query('page') page: string, @Query('limit') limit: string) {
    return this.ordersService.getUserOrders(
      req.user.userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create order from cart' })
  createOrder(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.userId, createOrderDto);
  }

  @Patch(':orderId/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  updateOrderStatus(@Param('orderId') orderId: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(orderId, updateOrderStatusDto);
  }

  @Patch(':orderId/payment-status')
  @ApiOperation({ summary: 'Update payment status' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  updatePaymentStatus(@Param('orderId') orderId: string, @Body() updatePaymentStatusDto: UpdatePaymentStatusDto) {
    return this.ordersService.updatePaymentStatus(orderId, updatePaymentStatusDto);
  }

  @Post(':orderId/pay-success')
  @ApiOperation({ summary: 'Simulate payment success' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  simulatePaymentSuccess(@Param('orderId') orderId: string) {
    return this.ordersService.simulatePaymentSuccess(orderId);
  }
}
