import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto, UpdatePaymentStatusDto, UpdateOrderStatusDto } from './dto/order.dto';
import { CartService } from '../cart/cart.service';
import { AddressType, OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService
  ) {}

  // Generate unique order number
  private generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${year}${month}${day}-${random}`;
  }

  // Create order from cart
  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    // Get cart items
    const cart = await this.cartService.getCart(userId);
    const cartItems = cart.items;

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    // Calculate subtotal
    const subtotal = cartItems.reduce(
      (sum: number, item: any) => sum + parseFloat(item.product.price.toString()) * item.quantity,
      0
    );

    // Calculate tax and shipping (simplified for now)
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 100 ? 0 : 5; // Free shipping over $100
    const total = subtotal + tax + shipping;

    // Create order in database
    const order = await this.prisma.order.create({
      data: {
        userId,
        orderNumber: this.generateOrderNumber(),
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        shipping: shipping.toString(),
        total: total.toString(),
        paymentMethod: createOrderDto.paymentMethod,
        notes: createOrderDto.notes,
        shippingAddress: {
          create: {
            userId,
            type: AddressType.SHIPPING,
            ...createOrderDto.shippingAddress
          }
        },
        billingAddress: createOrderDto.billingAddress ? {
          create: {
            userId,
            type: AddressType.BILLING,
            ...createOrderDto.billingAddress
          }
        } : undefined,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        shippingAddress: true,
        billingAddress: true
      }
    });

    // Clear cart after successful order creation
    await this.prisma.cartItem.deleteMany({
      where: { userId }
    });

    return order;
  }

  // Get user orders
  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Update order status
  async updateOrderStatus(orderId: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: updateOrderStatusDto.status
      }
    });
  }

  // Update payment status (for future Stripe integration)
  async updatePaymentStatus(orderId: string, updatePaymentStatusDto: UpdatePaymentStatusDto) {
    // For future Stripe integration, we would verify the payment here

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: updatePaymentStatusDto.paymentStatus,
      }
    });
  }

  // Simulate payment success (for development/testing)
  async simulatePaymentSuccess(orderId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED'
      }
    });
  }
}
