import {
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class UpdateMenuItemDto {
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumberString()
  @IsOptional()
  price?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsOptional()
  prepTime?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean; // OWner can toggle availability
}
