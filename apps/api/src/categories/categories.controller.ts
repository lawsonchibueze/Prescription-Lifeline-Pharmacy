import { Controller, Get, Param } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { CategoriesService } from './categories.service';

// Public catalog browsing — every route here is anonymous by design, since
// the global AuthGuard (see app.module.ts) protects everything by default.
@AllowAnonymous()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }
}
