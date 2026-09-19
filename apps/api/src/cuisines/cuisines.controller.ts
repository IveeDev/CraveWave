// cuisines.controller.ts
import { Controller, Get } from '@nestjs/common';
import { CuisinesService } from './cuisines.service';

@Controller('cuisines')
export class CuisinesController {
  constructor(private readonly cuisinesService: CuisinesService) {}

  @Get()
  findAll() {
    return this.cuisinesService.findAll();
  }
}
