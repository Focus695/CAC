import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductSectionDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  title_zh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  title_en?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  content_zh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  content_en?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;
}

export class CreateAdminProductDto {
  @IsString()
  @MaxLength(120)
  name_zh!: string;

  @IsString()
  @MaxLength(120)
  name_en!: string;

  @IsNumber()
  @Min(0.01)
  price!: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  comparePrice?: number;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  sku?: string;

  @IsInt()
  @Min(0)
  stock!: number;

  @IsString()
  categoryId!: string;

  @IsBoolean()
  isActive!: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  mainImage?: string;

  @IsArray()
  @ArrayMaxSize(9)
  @IsString({ each: true })
  detailImages!: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => ProductSectionDto)
  sections?: ProductSectionDto[];
}

export class UpdateAdminProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name_zh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name_en?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  comparePrice?: number;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  sku?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  mainImage?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(9)
  @IsString({ each: true })
  detailImages?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => ProductSectionDto)
  sections?: ProductSectionDto[];
}


