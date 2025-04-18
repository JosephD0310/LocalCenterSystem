import { Injectable } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
@Injectable()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  emitMqttData(data: any) {
    this.server.emit('mqtt-data', data);
  }
}
