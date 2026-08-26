import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: ProductQueryDto,
    { onlyActive = true }: { onlyActive?: boolean } = {},
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.ProductWhereInput = {
      ...(onlyActive ? { isActive: true } : {}),
      ...(query.category ? { category: { slug: query.category } } : {}),
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: 'insensitive' } },
              { description: { contains: query.q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!product || !product.isActive) {
      throw new NotFoundException(`Product "${slug}" not found`);
    }
    return product;
  }

  async create(dto: CreateProductDto) {
    await this.assertSlugFree(dto.slug);
    const { priceNaira, ...rest } = dto;
    return this.prisma.product.create({
      data: { ...rest, priceKobo: priceNaira * 100 },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findById(id);
    if (dto.slug) {
      await this.assertSlugFree(dto.slug, id);
    }
    const { priceNaira, ...rest } = dto;
    return this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(priceNaira !== undefined ? { priceKobo: priceNaira * 100 } : {}),
      },
    });
  }

  // Soft delete: products already referenced by an OrderItem can't be hard
  // deleted (FK RESTRICT preserves order history), and even unreferenced
  // ones are hidden rather than erased so admins can undo a mistake.
  async remove(id: string) {
    await this.findById(id);
    await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private async findById(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }

  private async assertSlugFree(slug: string, excludingId?: string) {
    const existing = await this.prisma.product.findUnique({ where: { slug } });
    if (existing && existing.id !== excludingId) {
      throw new ConflictException(`Product slug "${slug}" is already in use`);
    }
  }
}
