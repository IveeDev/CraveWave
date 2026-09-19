import {
  IsNumber,
  IsOptional,
  IsArray,
  IsUUID,
  IsString,
} from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  address!: string;

  @IsString()
  @IsOptional()
  kitchenPhone?: string;

  @IsNumber()
  @IsOptional()
  prepTimeMinutes?: number;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  cuisineIds?: string[];

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
