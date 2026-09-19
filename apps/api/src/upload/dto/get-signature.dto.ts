import { IsIn } from 'class-validator';

export const UPLOAD_TYPES = ['restaurant', 'menuItem', 'profile'] as const;
export type UploadType = (typeof UPLOAD_TYPES)[number];

export class GetSignatureDto {
  @IsIn(UPLOAD_TYPES)
  type!: UploadType;
}
