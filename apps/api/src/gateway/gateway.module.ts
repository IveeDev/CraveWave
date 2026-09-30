import { Module } from '@nestjs/common';
import { OrdersGateWay } from './orders.gateway';

@Module({
  providers: [OrdersGateWay],
  exports: [OrdersGateWay],
})
export class GatewayModule {}
