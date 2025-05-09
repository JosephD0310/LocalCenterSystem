import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { connect, MqttClient } from 'mqtt';
import { DevicesService } from 'src/devices/devices.service';
import { CreateDeviceDto } from 'src/devices/dto/create-device.dto';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class MqttService implements OnModuleInit {
    private client: MqttClient;
    private watchedSerials: Set<string> = new Set();

    constructor(
        @Inject(forwardRef(() => EventsGateway))
        private readonly eventsGateway: EventsGateway,
        private readonly devicesService: DevicesService,
    ) {}

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
                if (topic == 'terminal/data') {
                    const data = JSON.parse(payload.toString());
                    const serial = data.serialNumber;
                    data.updatedAt = new Date();

                    this.eventsGateway.emitMqttData(data);

                    const createDeviceDto: CreateDeviceDto = { ...data };
                    await this.devicesService.create(createDeviceDto);

                    // Subscribe to response topic dynamically
                    if (!this.watchedSerials.has(serial)) {
                        const controlTopic = `control/${serial}`;
                        const responseTopic = `response/${serial}`;
                        this.client.subscribe(controlTopic);
                        this.client.subscribe(responseTopic);
                        this.watchedSerials.add(serial);
                        console.log(`Subscribed to ${controlTopic}`);
                        console.log(`Subscribed to ${responseTopic}`);
                    }
                }

                if (topic.startsWith('response/')) {
                    const serial = topic.split('/')[1];
                    const response = JSON.parse(payload.toString());

                    console.log(`Response from ${serial}:`, response);
                    this.eventsGateway.emitDeviceResponse(serial, response);
                }
            } catch (error) {
                console.error('Error handling MQTT message:', error);
            }
        });
    }

    publishToDevice(serial: string, message: string) {
        const topic = `control/${serial}`;
        this.client.publish(topic, message);
    }
}
