import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Placeholder - implement cart operations
  async getCart(userId: string) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
  }
}

