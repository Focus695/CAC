import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CartModule } from '../cart/cart.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [CartModule, PrismaModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
