import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class OrderItemInputDto {
  @IsString()
  productId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items!: OrderItemInputDto[];

  @IsString()
  @MinLength(2)
  shippingName!: string;

  @IsString()
  @MinLength(7)
  shippingPhone!: string;

  @IsString()
  @MinLength(5)
  shippingAddress!: string;

  @IsString()
  @MinLength(2)
  shippingCity!: string;

  @IsString()
  @MinLength(2)
  shippingState!: string;
}
