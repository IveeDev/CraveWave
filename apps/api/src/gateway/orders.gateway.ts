import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import { LocationService } from '../location/location.service';

export interface DriverLocation {
  driverId: string;
  orderId: string;
  latitude: number;
  longitude: number;
}

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/orders',
})
export class OrdersGateWay implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join:order')
  handleJoinOrder(
    @ConnectedSocket() client: Socket,
    @MessageBody() orderId: string,
  ) {
    client.join(`order:${orderId}`);
    console.log(`Client ${client.id} joined order room: ${orderId}`);
  }

  @SubscribeMessage('join:restaurant')
  handleJoinRestaurant(
    @ConnectedSocket() client: Socket,
    @MessageBody() restaurantId: string,
  ) {
    client.join(`restaurant:${restaurantId}`);
    console.log(`Client ${client.id} joined restaurant room: ${restaurantId}`);
  }

  @SubscribeMessage('join:driver')
  handleJoinDriver(
    @ConnectedSocket() client: Socket,
    @MessageBody() driverId: string,
  ) {
    client.join(`driver:${driverId}`);
    console.log(`Client ${client.id} joined driver:${driverId}`);
  }

  emitDriverAssigned(driverId: string, order: Record<string, unknown>) {
    this.server.to(`driver:${driverId}`).emit('driver:assigned', order);
  }

  emitOrderUdpate(order: {
    id: string;
    restaurantId: string;
    status: string;
    [key: string]: unknown;
  }) {
    // Customer Wathcjing this order
    this.server.to(`order:${order.id}`).emit('order:updated', order);
    // Owner of the restaurant Watching this order
    this.server
      .to(`restaurant:${order.restaurantId}`)
      .emit('order:updated', order);
    // Driver assigned to this order
    this.server.to(`driver:${order.driverId}`).emit('order:updated', order);
  }
}
