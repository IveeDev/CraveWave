import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrderService } from './orders.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [OrdersController],
  providers: [OrderService],
})
export class OrderModule {}
