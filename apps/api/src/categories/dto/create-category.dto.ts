import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  // URL-safe identifier, e.g. "over-the-counter". Kept independent of name
  // so it never breaks incoming links if the display name is edited later.
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  slug!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  imageUrl?: string;
}
