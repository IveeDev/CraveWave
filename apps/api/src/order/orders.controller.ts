import {
  Body,
  Controller,
  Get,
  Param,
  Request,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { OrderService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole, JwtPayload } from '@food-delivery/types';
import { RolesGuard } from '../auth/guards/role.guard';

type AuthRequest = ExpressRequest & { user: JwtPayload };

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private orderService: OrderService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.CUSTOMER)
  create(@Request() req: AuthRequest, @Body() dto: CreateOrderDto) {
    return this.orderService.create(req.user.sub, dto);
  }

  @Get('mine') //Get my orders(customer)
  @UseGuards(RolesGuard)
  @Roles(UserRole.CUSTOMER)
  findMine(@Request() req: AuthRequest) {
    return this.orderService.findByCustomer(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    // pass the logged-in user so the service can enforce role-based access
    return this.orderService.findById(id, req.user);
  }
}
