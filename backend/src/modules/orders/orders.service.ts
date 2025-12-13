import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
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

    // Calculate subtotal using Prisma Decimal
    const subtotal = cartItems.reduce((sum: Decimal, item: any) => {
      return sum.add(item.product.price.times(item.quantity));
    }, new Decimal(0));

    // Calculate tax and shipping (simplified for now)
    const tax = subtotal.times(0.1); // 10% tax
    const shipping = subtotal.greaterThan(new Decimal(100)) ? new Decimal(0) : new Decimal(5); // Free shipping over $100
    const total = subtotal.add(tax).add(shipping);

    // Create order and clear cart in a transaction to ensure data consistency
    const order = await this.prisma.$transaction(async (prisma) => {
      // Create order in database
      const createdOrder = await prisma.order.create({
        data: {
          user: {
            connect: { id: userId }
          },
          orderNumber: this.generateOrderNumber(),
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          subtotal,
          tax,
          shipping,
          total,
          paymentMethod: createOrderDto.paymentMethod,
          notes: createOrderDto.notes,
          shippingAddress: {
            create: {
              user: {
                connect: { id: userId }
              },
              type: AddressType.SHIPPING,
              ...createOrderDto.shippingAddress
            }
          },
          billingAddress: createOrderDto.billingAddress ? {
            create: {
              user: {
                connect: { id: userId }
              },
              type: AddressType.BILLING,
              ...createOrderDto.billingAddress
            }
          } : undefined,
          items: {
            create: cartItems.map(item => ({
              product: {
                connect: { id: item.productId }
              },
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
      await prisma.cartItem.deleteMany({
        where: { userId }
      });

      return createdOrder;
    });

    return order;
  }

  // Get user orders
  async getUserOrders(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
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
      skip,
      take: limit,
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

  // Get all orders (admin only) with search, filter, and sort
  async getAllOrders(
    page: number = 1,
    limit: number = 10,
    search?: string,
    filter?: {
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
      paymentMethod?: string;
      userId?: string;
    },
    sort?: { field: string; order: 'asc' | 'desc' }
  ) {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Search by order number or user email
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Filter by status
    if (filter?.status) {
      where.status = filter.status;
    }

    // Filter by payment status
    if (filter?.paymentStatus) {
      where.paymentStatus = filter.paymentStatus;
    }

    // Filter by payment method
    if (filter?.paymentMethod) {
      where.paymentMethod = filter.paymentMethod;
    }

    // Filter by user ID
    if (filter?.userId) {
      where.userId = filter.userId;
    }

    // Build order by clause
    const orderBy: any = {};
    if (sort?.field) {
      orderBy[sort.field] = sort.order;
    } else {
      // Default sort by createdAt descending
      orderBy.createdAt = 'desc';
    }

    // Get total count
    const totalCount = await this.prisma.order.count({ where });

    // Get orders
    const orders = await this.prisma.order.findMany({
      include: {
        user: {
          select: {
            email: true,
            username: true
          }
        },
        items: {
          include: {
            product: true
          }
        },
        shippingAddress: true
      },
      where,
      orderBy,
      skip,
      take: limit
    });

    // Return with pagination info
    return {
      orders,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
    };
  }

  // Get order details by id (admin only)
  async getOrderDetails(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            email: true,
            username: true
          }
        },
        items: {
          include: {
            product: true
          }
        },
        shippingAddress: true,
        billingAddress: true
      }
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return order;
  }

  // Mark order as shipped with tracking number
  async shipOrder(orderId: string, trackingNumber: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.SHIPPED,
        trackingNumber
      }
    });
  }

  // Mark order as delivered
  async markOrderDelivered(orderId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.DELIVERED
      }
    });
  }
}
