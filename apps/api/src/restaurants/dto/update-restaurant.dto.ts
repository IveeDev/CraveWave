import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateRestaurantDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  kitchenPhone?: string;

  @IsNumber()
  @IsOptional()
  prepTimeMinutes?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isAcceptingOrders?: boolean;

  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true })
  cuisineIds?: string[];
}
