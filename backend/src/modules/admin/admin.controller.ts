import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminAuthGuard)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
  ) { }

  // User Management
  @Get('users')
  getUsers(@Query() query: any) {
    return this.usersService.findAll();
  }

  @Put('users/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // Product Management
  @Get('products')
  getProducts(@Query() query: any) {
    return this.productsService.findAll();
  }

  @Post('products')
  createProduct(@Body() productData: any) {
    return this.productsService.create(productData);
  }

  @Put('products/:id')
  updateProduct(@Param('id') id: string, @Body() productData: any) {
    return this.productsService.update(id, productData);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  @Patch('products/:id/status')
  toggleProductStatus(@Param('id') id: string) {
    return this.productsService.toggleStatus(id);
  }

  // Order Management
  @Get('orders')
  getOrders(@Query() query: any) {
    return this.ordersService.getAllOrders();
  }

  @Get('orders/:id')
  getOrderDetails(@Param('id') id: string) {
    return this.ordersService.getOrderDetails(id);
  }

  @Put('orders/:id/ship')
  shipOrder(@Param('id') id: string, @Body() body: { trackingNumber: string }) {
    return this.ordersService.shipOrder(id, body.trackingNumber);
  }

  @Put('orders/:id/deliver')
  deliverOrder(@Param('id') id: string) {
    return this.ordersService.markOrderDelivered(id);
  }
}
