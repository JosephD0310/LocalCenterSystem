import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { response } from 'express';
import { Server } from 'socket.io';
import { MqttService } from 'src/mqtt/mqtt.service';

@WebSocketGateway({ cors: true })
@Injectable()
export class EventsGateway {
    constructor(@Inject(forwardRef(() => MqttService)) private readonly mqttService: MqttService) {}

    @WebSocketServer()
    server: Server;

    emitMqttData(data: any) {
        this.server.emit('mqtt-data', data);
    }

    emitDeviceResponse(serial: string, res: any) {
        const message = {
            serial: serial,
            response: res,
        };
        this.server.emit('mqtt-response', message);
    }

    @SubscribeMessage('mqtt-control')
    handleControlReq(@MessageBody() payload: any) {
        console.log('Received command from frontend:', payload);

        this.mqttService.publishToDevice(payload.serialNumber, JSON.stringify(payload.control));
    }
}
