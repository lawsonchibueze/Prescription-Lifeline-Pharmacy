import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({ where: { slug } });
    if (!category) {
      throw new NotFoundException(`Category "${slug}" not found`);
    }
    return category;
  }

  async create(dto: CreateCategoryDto) {
    await this.assertSlugFree(dto.slug);
    return this.prisma.category.create({ data: dto });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findById(id);
    if (dto.slug) {
      await this.assertSlugFree(dto.slug, id);
    }
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findById(id);
    // Products reference categories with a required FK (no onDelete), so a
    // category still holding products fails with a clear FK error rather
    // than silently orphaning them — the admin has to move/delete those first.
    await this.prisma.category.delete({ where: { id } });
  }

  private async findById(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }
    return category;
  }

  private async assertSlugFree(slug: string, excludingId?: string) {
    const existing = await this.prisma.category.findUnique({ where: { slug } });
    if (existing && existing.id !== excludingId) {
      throw new ConflictException(`Category slug "${slug}" is already in use`);
    }
  }
}
