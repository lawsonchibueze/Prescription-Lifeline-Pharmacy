import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  slug!: string;

  @IsString()
  @MinLength(10)
  description!: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @IsUrl({ require_tld: false }, { each: true })
  images?: string[];

  // Naira amount from the client is converted to kobo in the service layer
  // (see ProductsService) so this DTO stays in the unit a form actually
  // submits — Prisma stores priceKobo, this field is priceNaira.
  @Type(() => Number)
  @IsInt()
  @Min(1)
  priceNaira!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock!: number;

  @IsOptional()
  @IsBoolean()
  requiresPrescription?: boolean;

  @IsString()
  categoryId!: string;
}
