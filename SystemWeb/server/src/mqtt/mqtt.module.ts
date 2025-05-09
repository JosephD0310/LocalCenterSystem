import { forwardRef, Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { EventsModule } from 'src/events/events.module';
import { DevicesModule } from 'src/devices/devices.module';

@Module({
  imports: [forwardRef(() => EventsModule), DevicesModule],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
