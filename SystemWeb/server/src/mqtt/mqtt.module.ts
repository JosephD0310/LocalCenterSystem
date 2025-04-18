import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [EventsModule],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
