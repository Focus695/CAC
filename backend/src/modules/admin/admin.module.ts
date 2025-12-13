import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [UsersModule, ProductsModule, OrdersModule, AuthModule],
  controllers: [AdminController],
})
export class AdminModule { }
