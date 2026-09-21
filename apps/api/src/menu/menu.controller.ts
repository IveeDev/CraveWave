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
  Delete,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '@food-delivery/types';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '@food-delivery/types';
import { Request as ExpressRequest } from 'express';

type AuthRequest = ExpressRequest & { user: JwtPayload };

@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  createCategory(@Request() req: AuthRequest, @Body() dto: CreateCategoryDto) {
    return this.menuService.createCategory(req.user.sub, dto);
  }

  @Get('categories/:restaurantId')
  getCategories(@Param('restaurantId') restaurantId: string) {
    return this.menuService.getCategories(restaurantId);
  }

  @Patch('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  updateCategory(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.menuService.updateCategory(id, req.user.sub, dto);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  deleteCategory(@Request() req: AuthRequest, @Param() id: string) {
    return this.menuService.deleteCategory(id, req.user.sub);
  }

  //   MenuItems

  @Post('items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  createMenuItem(@Request() req: AuthRequest, @Body() dto: CreateMenuItemDto) {
    return this.menuService.createMenuItem(req.user.sub, dto);
  }

  @Get('items/:restaurantId')
  getMenuItems(@Param('restaurantId') restaurantId: string) {
    return this.menuService.getItemsByRestaurant(restaurantId);
  }

  @Patch('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  updateMenuItem(
    @Param('id') id: string,
    @Request() req: AuthRequest,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.menuService.updateMenuItem(id, req.user.sub, dto);
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  deleteMenuItem(@Request() req: AuthRequest, @Param() id: string) {
    return this.menuService.deleteMenuItem(id, req.user.sub);
  }
}
