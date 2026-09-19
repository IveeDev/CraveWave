import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';

import { RestaurantsService } from './restaurants.service';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '@food-delivery/types';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '@food-delivery/types';
import { Request as ExpressRequest } from 'express';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

type AuthRequest = ExpressRequest & { user: JwtPayload };

@Controller('restaurants')
@UseGuards(JwtAuthGuard)
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  create(@Request() req: AuthRequest, @Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(req.user.sub, dto);
  }

  @Get('mine')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  findMyRestaurant(@Request() req: AuthRequest) {
    return this.restaurantsService.findMyRestaurant(req.user.sub);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('cuisineIds') cuisineIds?: string,
  ) {
    return this.restaurantsService.findAll({
      search,
      cuisineIds: cuisineIds ? cuisineIds.split(',') : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantDto,
    @Request() req: AuthRequest,
  ) {
    return this.restaurantsService.update(id, dto, req.user.sub);
  }
}
