import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        children: true,
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findAllAdmin() {
    return this.prisma.category.findMany({
      include: {
        children: true,
        parent: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    const base = baseSlug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '').replace(/\-+/g, '-');
    let unique = base || 'category';
    let counter = 1;
    while (true) {
      const existing = await this.prisma.category.findUnique({ where: { slug: unique } });
      if (!existing || (excludeId && existing.id === excludeId)) return unique;
      unique = `${base}-${counter++}`;
    }
  }

  async createAdmin(data: any) {
    const name: string = String(data?.name || '').trim();
    const rawSlug: string = String(data?.slug || name).trim();
    const slug = await this.ensureUniqueSlug(rawSlug);

    return this.prisma.category.create({
      data: {
        name,
        slug,
        description: data?.description ?? undefined,
        image: data?.image ?? undefined,
        parentId: data?.parentId ?? undefined,
        isActive: data?.isActive ?? true,
      },
    });
  }

  async updateAdmin(id: string, data: any) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Category with ID ${id} not found`);

    const updated: any = { ...data };
    if (typeof data?.name === 'string') updated.name = data.name.trim();
    if (typeof data?.slug === 'string' || typeof data?.name === 'string') {
      const rawSlug = String(data?.slug || updated.name || existing.name).trim();
      updated.slug = await this.ensureUniqueSlug(rawSlug, id);
    }

    return this.prisma.category.update({ where: { id }, data: updated });
  }

  async deleteAdmin(id: string) {
    try {
      return await this.prisma.category.delete({ where: { id } });
    } catch (e: any) {
      // foreign key restriction if products exist
      if (e?.code === 'P2003') {
        throw new ConflictException('Category has products and cannot be deleted');
      }
      if (e?.code === 'P2025') {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      throw e;
    }
  }

  async toggleStatus(id: string) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Category with ID ${id} not found`);
    return this.prisma.category.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });
  }
}
