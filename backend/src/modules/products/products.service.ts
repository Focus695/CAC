import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type ProductSection = {
  title_zh?: string;
  title_en?: string;
  content_zh?: string;
  content_en?: string;
  order?: number;
};

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private hasAnySectionContent(sections: ProductSection[] | undefined): boolean {
    if (!sections || sections.length === 0) return false;
    return sections.some((s) => {
      const tzh = s.title_zh && String(s.title_zh).trim();
      const ten = s.title_en && String(s.title_en).trim();
      const czh = s.content_zh && String(s.content_zh).trim();
      const cen = s.content_en && String(s.content_en).trim();
      return Boolean(tzh || ten || czh || cen);
    });
  }

  private normalizeSectionsFromLegacyFields(product: any): ProductSection[] {
    const sections: ProductSection[] = [];

    const pushIfAny = (s: ProductSection) => {
      const hasAny =
        (s.title_zh && String(s.title_zh).trim()) ||
        (s.title_en && String(s.title_en).trim()) ||
        (s.content_zh && String(s.content_zh).trim()) ||
        (s.content_en && String(s.content_en).trim());
      if (hasAny) sections.push(s);
    };

    // We no longer use hardcoded Chinese titles for legacy fields
    // All section titles should be provided explicitly when creating/updating products
    pushIfAny({
      title_en: 'Craftsmanship',
      content_zh: product?.craftsmanship_zh ?? undefined,
      content_en: product?.craftsmanship_en ?? undefined,
    });
    pushIfAny({
      title_en: 'Elegant Description',
      content_zh: product?.elegantDesc_zh ?? undefined,
      content_en: product?.elegantDesc_en ?? undefined,
    });
    pushIfAny({
      title_en: 'Health Benefits',
      content_zh: product?.healthBenefits_zh ?? undefined,
      content_en: product?.healthBenefits_en ?? undefined,
    });

    return sections.map((s, idx) => ({ ...s, order: idx + 1 }));
  }

  private normalizeSections(sections: unknown): ProductSection[] | undefined {
    if (!Array.isArray(sections)) return undefined;
    const normalized = sections
      .slice(0, 3)
      .map((raw: any, idx: number) => ({
        title_zh: raw?.title_zh ? String(raw.title_zh).trim() : undefined,
        title_en: raw?.title_en ? String(raw.title_en).trim() : undefined,
        content_zh: raw?.content_zh ? String(raw.content_zh) : undefined,
        content_en: raw?.content_en ? String(raw.content_en) : undefined,
        order: typeof raw?.order === 'number' ? raw.order : idx + 1,
      }))
      .filter((s) => (s.title_zh || s.title_en || s.content_zh || s.content_en));

    return normalized.map((s, idx) => ({ ...s, order: idx + 1 }));
  }

  private attachSections(product: any) {
    if (!product) return product;
    const existing = this.normalizeSections(product.sections);
    if (existing && existing.length > 0) {
      return { ...product, sections: existing };
    }
    const legacy = this.normalizeSectionsFromLegacyFields(product);
    return { ...product, sections: legacy };
  }

  private async assertPublishable(product: any): Promise<void> {
    const p = this.attachSections(product);

    if (!p?.name_zh || !String(p.name_zh).trim()) throw new BadRequestException('name_zh is required');
    if (!p?.name_en || !String(p.name_en).trim()) throw new BadRequestException('name_en is required');

    const priceNum = Number(p?.price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) throw new BadRequestException('price must be > 0');

    if (!p?.categoryId) throw new BadRequestException('categoryId is required');
    const category = await this.prisma.category.findUnique({ where: { id: p.categoryId } });
    if (!category || category.isActive !== true) {
      throw new ConflictException('category is not available');
    }

    if (!p?.mainImage || !String(p.mainImage).trim()) {
      throw new BadRequestException('mainImage is required for publishing');
    }

    const detailImages = Array.isArray(p?.detailImages) ? p.detailImages : [];
    if (detailImages.length > 9) throw new BadRequestException('detailImages max size is 9');

    const sections = Array.isArray(p?.sections) ? (p.sections as ProductSection[]) : [];
    if (sections.length > 3) throw new BadRequestException('sections max size is 3');
    if (!this.hasAnySectionContent(sections)) {
      throw new BadRequestException('At least 1 introduction section is required for publishing');
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    filter?: { categoryId?: string; isActive?: boolean },
    sort?: { field: string; order: 'asc' | 'desc' }
  ) {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Search by name (Chinese/English), slug, SKU, and legacy intro fields
    if (search) {
      where.OR = [
        { name_zh: { contains: search, mode: 'insensitive' } },
        { name_en: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { craftsmanship_zh: { contains: search, mode: 'insensitive' } },
        { craftsmanship_en: { contains: search, mode: 'insensitive' } },
        { elegantDesc_zh: { contains: search, mode: 'insensitive' } },
        { elegantDesc_en: { contains: search, mode: 'insensitive' } },
        { healthBenefits_zh: { contains: search, mode: 'insensitive' } },
        { healthBenefits_en: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by category
    if (filter?.categoryId) {
      where.categoryId = filter.categoryId;
    }

    // Filter by active status
    if (filter?.isActive !== undefined) {
      where.isActive = filter.isActive;
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
    const totalCount = await this.prisma.product.count({ where });

    // Get products
    const products = await this.prisma.product.findMany({
      include: {
        category: true,
      },
      where,
      skip,
      take: limit,
      orderBy,
    });

    // Return with pagination info
    return {
      products: products.map((p) => this.attachSections(p)),
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

    return this.attachSections(product);
  }

  // Create new product with multilingual support
  async create(productData: any) {
    // Generate unique slug from Chinese name
    let slug = productData.name_zh.toLowerCase().replace(/\s+/g, '-');

    // Check if slug already exists and generate unique one if needed
    let uniqueSlug = slug;
    let counter = 1;

    while (await this.prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const sections = this.normalizeSections(productData?.sections);
    const willBeActive = Boolean(productData?.isActive);

    if (willBeActive) {
      // Prevent bypassing /publish: creating active product must satisfy publish rules
      await this.assertPublishable({
        ...productData,
        sections: sections ?? [],
      });
    }

    return this.prisma.product.create({
      data: {
        ...productData,
        sections,
        slug: uniqueSlug,
        // Last publish time on create if created as active
        publishedAt: willBeActive ? new Date() : undefined,
        unpublishedAt: willBeActive ? null : undefined,
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
    const updatedData = { ...productData };
    if (productData.name_zh) {
      let slug = productData.name_zh.toLowerCase().replace(/\s+/g, '-');

      // Check if slug already exists and generate unique one if needed
      let uniqueSlug = slug;
      let counter = 1;

      while (true) {
        const existingProduct = await this.prisma.product.findUnique({ where: { slug: uniqueSlug } });
        // If slug doesn't exist or it's the current product's slug, break
        if (!existingProduct || existingProduct.id === id) {
          break;
        }
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }

      updatedData.slug = uniqueSlug;
    }

    if ('sections' in productData) {
      updatedData.sections = this.normalizeSections(productData?.sections) ?? [];
    }

    if ('isActive' in productData) {
      const nextIsActive = Boolean(productData?.isActive);
      if (nextIsActive && !product.isActive) {
        // Prevent bypassing /publish: activating via update must satisfy publish rules
        await this.assertPublishable({
          ...product,
          ...updatedData,
        });
        updatedData.publishedAt = new Date();
        updatedData.unpublishedAt = null;
      }
      if (!nextIsActive && product.isActive) {
        updatedData.unpublishedAt = new Date();
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updatedData,
    });
  }

  async publish(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);

    await this.assertPublishable(product);

    return this.prisma.product.update({
      where: { id },
      data: {
        isActive: true,
        // Last publish time
        publishedAt: new Date(),
        unpublishedAt: null,
      },
    });
  }

  async unpublish(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);

    return this.prisma.product.update({
      where: { id },
      data: {
        isActive: false,
        unpublishedAt: new Date(),
      },
    });
  }

  // Delete product
  async delete(id: string) {
    try {
      const deletedProduct = await this.prisma.product.delete({
        where: { id },
      });
      return deletedProduct;
    } catch (error) {
      if (error instanceof Error && (error as any).code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }

  // Toggle product status
  async toggleStatus(id: string) {
    // Prisma doesn't support toggling in a single update, so we need to read first
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Backward compatible toggle: map to publish/unpublish workflow
    if (product.isActive) return this.unpublish(id);
    return this.publish(id);
  }
}
