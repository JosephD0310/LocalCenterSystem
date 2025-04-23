import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';

@Controller('devices')
export class DevicesController {
    constructor(private readonly devicesService: DevicesService) {}

    @Get()
    getAll() {
        return this.devicesService.findAll();
    }

    @Get(':uuid')
    getOne(@Param('uuid') uuid: string) {
        return this.devicesService.findOne(uuid);
    }

    @Post()
    create(@Body() dto: CreateDeviceDto) {
        return this.devicesService.create(dto);
    }

    @Put(':uuid')
    update(@Param('uuid') uuid: string, @Body() dto: CreateDeviceDto) {
        return this.devicesService.update(uuid, dto);
    }

    @Delete(':deviceId')
    remove(@Param('deviceId') deviceId: number) {
        return this.devicesService.delete(deviceId);
    }
}
