import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  handleJoin(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    client.join(`user_${data.userId}`);
    console.log(`User ${data.userId} joined notifications`);
  }

  sendOrderNotification(data: any) {
    this.server.to(`user_${data.userId}`).emit('orderUpdate', {
      message: data.status === 'New order placed'
        ? 'Your order has been placed successfully!'
        : `Your order #${data.orderId} has been updated to status: ${data.status}`,
      orderId: data.orderId,
      total: data.total,
    });

    this.server.emit('adminNotification', {
      message: data.status === 'New order placed'
        ? `New order #${data.orderId} placed`
        : `Order #${data.orderId} updated to ${data.status}`,
      orderId: data.orderId,
      total: data.total,
      type: data.status === 'New order placed' ? 'new_order' : 'order_update',
    });
  }

}