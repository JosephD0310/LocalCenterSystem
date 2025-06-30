import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('devices')
export class DevicesController {
    constructor(private readonly devicesService: DevicesService) {}

    @UseGuards(JwtAuthGuard)
    @Get('latest-all')
    async getLatestOfAll() {
        return this.devicesService.findLatestOfAllDevices();
    }

    @UseGuards(JwtAuthGuard)
    @Get('latest-by-room/:room')
    async getLatestByRoom(@Param('room') room: string) {
        return this.devicesService.findLatestByRoom(room);
    }

    @UseGuards(JwtAuthGuard)
    @Get('usage-logs/:serialNumber')
    getHistory(@Param('serialNumber') serialNumber: string) {
        return this.devicesService.findAllBySerialNumber(serialNumber);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateDeviceDto) {
        return this.devicesService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':serialNumber')
    remove(@Param('serialNumber') serialNumber: string) {
        return this.devicesService.delete(serialNumber);
    }
}
