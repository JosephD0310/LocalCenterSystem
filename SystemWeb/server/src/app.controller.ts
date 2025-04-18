import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MqttService } from './mqtt/mqtt.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly mqttService: MqttService,
    ) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
