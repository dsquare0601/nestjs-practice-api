import { IsString, IsNumber, Min, MaxLength } from 'class-validator';
import { IsPriceRange } from '../../common/decorators/validation.decorators';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @Transform(({ value }: { value: string }) => value.trim())
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name!: string;

  @IsString({ message: 'Description must be a string' })
  description!: string;

  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsNumber({}, { message: 'Price must be a number' })
  @IsPriceRange(0, 100000, { message: 'Price must be between 0 and 100000' })
  price!: number;

  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock cannot be negative' })
  stock!: number;

  @Transform(({ value }: { value: string }) => value.toLowerCase())
  @IsString({ message: 'Category must be a string' })
  category!: string;
}
