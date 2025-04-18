import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, MqttClient } from 'mqtt';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class MqttService implements OnModuleInit {
  constructor(private readonly eventsGateway: EventsGateway) {}
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

        this.client.on('message', (topic, payload) => {
            const data = JSON.parse(payload.toString());

            this.eventsGateway.emitMqttData(data)
        });
    }

    publish(topic: string, message: string) {
        this.client.publish(topic, message);
    }
}
