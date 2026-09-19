import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // match whatever guard your other routes use
import { GetSignatureDto, UploadType } from './dto/get-signature.dto';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER_BY_TYPE: Record<UploadType, string> = {
  restaurant: 'restaurant-images',
  menuItem: 'menu-item-images',
  profile: 'profile-images',
};

@Controller('uploads')
export class UploadsController {
  @Post('signature')
  @UseGuards(JwtAuthGuard)
  getSignature(@Body() body: GetSignatureDto) {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = FOLDER_BY_TYPE[body.type];

    const paramsToSign = { timestamp, folder };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!,
    );

    return {
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder,
    };
  }
}
