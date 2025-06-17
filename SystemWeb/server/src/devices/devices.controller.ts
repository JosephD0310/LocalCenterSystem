import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';

@Controller('devices')
export class DevicesController {
    constructor(private readonly devicesService: DevicesService) {}

    @Get('latest-all')
    async getLatestOfAll() {
        return this.devicesService.findLatestOfAllDevices();
    }

    @Get('latest-by-room/:room')
    async getLatestByRoom(@Param('room') room: string) {
        return this.devicesService.findLatestByRoom(room);
    }

    @Get('usage-logs/:serialNumber')
    getHistory(@Param('serialNumber') serialNumber: string) {
        return this.devicesService.findAllBySerialNumber(serialNumber);
    }

    @Post()
    create(@Body() dto: CreateDeviceDto) {
        return this.devicesService.create(dto);
    }

    @Delete(':serialNumber')
    remove(@Param('serialNumber') serialNumber: string) {
        return this.devicesService.delete(serialNumber);
    }
}
