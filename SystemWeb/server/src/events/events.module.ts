import { forwardRef, Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { MqttModule } from 'src/mqtt/mqtt.module';

@Module({
  imports: [forwardRef(() => MqttModule)],
  providers: [EventsGateway],
  exports: [EventsGateway]
})
export class EventsModule {}
