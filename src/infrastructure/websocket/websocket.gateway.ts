import {
  WebSocketGateway as WSGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { WebSocketEvents } from './websocket.events';
import { WsAuthGuard } from './guards/ws-auth.guard';

@WSGateway({
  cors: {
    origin: '*',
  },
})
export class WebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('WebSocketGateway');

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Method to emit events to all connected clients
  emitToAll(event: WebSocketEvents, payload: any): void {
    this.server.emit(event, payload);
  }

  // Method to emit events to a specific room
  emitToRoom(room: string, event: WebSocketEvents, payload: any): void {
    this.server.to(room).emit(event, payload);
  }

  // Method to join a room
  private joinRoom(clientId: string, room: string): void {
    const client = this.server.sockets.sockets.get(clientId);
    if (client) {
      void client.join(room);
      this.logger.log(`Client ${clientId} joined room: ${room}`);
    }
  }

  // Method to leave a room
  private leaveRoom(clientId: string, room: string): void {
    const client = this.server.sockets.sockets.get(clientId);
    if (client) {
      void client.leave(room);
      this.logger.log(`Client ${clientId} left room: ${room}`);
    }
  }

  @SubscribeMessage(WebSocketEvents.JOIN_ROOM)
  @UseGuards(WsAuthGuard)
  handleJoinRoom(client: Socket, room: string): void {
    this.joinRoom(client.id, room);
  }

  @SubscribeMessage(WebSocketEvents.LEAVE_ROOM)
  @UseGuards(WsAuthGuard)
  handleLeaveRoom(client: Socket, room: string): void {
    this.leaveRoom(client.id, room);
  }
}
