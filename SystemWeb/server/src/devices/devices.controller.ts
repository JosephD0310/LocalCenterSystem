import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';

@Controller('devices')
export class DevicesController {
    constructor(private readonly devicesService: DevicesService) {}

    @Post()
    create(@Body() createDeviceDto: CreateDeviceDto) {
        return this.devicesService.create(createDeviceDto);
    }

    @Get()
    findAll() {
        return this.devicesService.findAll();
    }

    @Get(':deviceId')
    findOne(@Param('deviceId') deviceId: string) {
        return this.devicesService.findByDeviceId(deviceId);
    }

    @Put(':deviceId')
    update(@Param('deviceId') deviceId: string, @Body() updateDeviceDto: CreateDeviceDto) {
        return this.devicesService.update(deviceId, updateDeviceDto);
    }
}
