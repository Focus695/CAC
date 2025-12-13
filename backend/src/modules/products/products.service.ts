import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  // Create new product with multilingual support
  async create(productData: any) {
    // Generate slug from Chinese name for now, can be improved later
    const slug = productData.name_zh.toLowerCase().replace(/\s+/g, '-');

    return this.prisma.product.create({
      data: {
        ...productData,
        slug,
      },
    });
  }

  // Update product
  async update(id: string, productData: any) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Generate new slug if name_zh changed
    let updatedData = productData;
    if (productData.name_zh) {
      updatedData.slug = productData.name_zh.toLowerCase().replace(/\s+/g, '-');
    }

    return this.prisma.product.update({
      where: { id },
      data: updatedData,
    });
  }

  // Delete product
  async delete(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }

  // Toggle product status
  async toggleStatus(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        isActive: !product.isActive,
      },
    });
  }
}
