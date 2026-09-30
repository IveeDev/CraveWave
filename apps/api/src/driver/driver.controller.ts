import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { JwtPayload, UserRole } from '@food-delivery/types';
import { DriverService } from './driver.service';
import { Request as ExpressRequest } from 'express';
import { Roles } from '../auth/decorators/role.decorator';

type AuthRequest = ExpressRequest & { user: JwtPayload };

@Controller('driver')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DRIVER)
export class DriverController {
  constructor(private driverService: DriverService) {}

  @Patch('online')
  toggleOnline(@Request() req: AuthRequest) {
    return this.driverService.toggleOnline(req.user.sub);
  }

  @Get('status')
  getStatus(@Request() req: AuthRequest) {
    return this.driverService.getStatus(req.user.sub);
  }

  @Patch('orders/:id/decline')
  declineOrder(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.driverService.declineOrder(id, req.user.sub);
  }
}
