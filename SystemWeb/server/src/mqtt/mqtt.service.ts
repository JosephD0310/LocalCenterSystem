import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, MqttClient } from 'mqtt';
import { DevicesService } from 'src/devices/devices.service';
import { CreateDeviceDto } from 'src/devices/dto/create-device.dto';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class MqttService implements OnModuleInit {
    constructor(
        private readonly eventsGateway: EventsGateway,
        private readonly devicesService: DevicesService,
    ) {}
    private client: MqttClient;

    onModuleInit() {
        console.log('Hellomqtt');
        this.client = connect('mqtts://df2c46d2a9b5447ca9f473c7f369c931.s1.eu.hivemq.cloud:8883', {
            username: 'localcenter',
            password: 'Local123',
        });

        this.client.on('connect', () => {
            console.log('Connected to MQTT Broker');

            this.client.subscribe('terminal/data', () => {
                console.log('Subscribed to terminal/data');
            });
        });

        this.client.on('message', async (topic, payload) => {
            try {
                const data = JSON.parse(payload.toString());
                data.updatedAt = new Date();
            
                this.eventsGateway.emitMqttData(data);
            
                const createDeviceDto: CreateDeviceDto = {
                  uuid: data.uuid,
                  deviceId: data.deviceId,
                  room: data.room,
                  hostname: data.hostname,
                  ipAddress: data.ipAddress,
                  macAddress: data.macAddress,
                  cpu: data.cpu,
                  ram: data.ram,
                  drives: data.drives,
                  firewalls: data.firewalls
                };
            
                const existingDevice = await this.devicesService.findOne(data.UUID);
            
                if (existingDevice) {
                  // Cập nhật thiết bị nếu đã tồn tại
                  await this.devicesService.update(data.UUID, createDeviceDto);
                  console.log(`Updated device with ID: ${data.deviceId}`);
                } else {
                  // Tạo mới nếu chưa có
                  await this.devicesService.create(createDeviceDto);
                  console.log(`Created new device with ID: ${data.deviceId}`);
                }
              } catch (error) {
                console.error('Error handling MQTT message:', error);
              }
        });
    }

    publish(topic: string, message: string) {
        this.client.publish(topic, message);
    }
}
