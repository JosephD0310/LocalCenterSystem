import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeviceDto } from './dto/create-device.dto';

@Injectable()
export class DevicesService {
    constructor(
        @InjectRepository(Device)
        private devicesRepository: Repository<Device>,
    ) {}

    async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
        const device = this.devicesRepository.create(createDeviceDto);
        return await this.devicesRepository.save(device);
      }

    async findByDeviceId(deviceId: string): Promise<Device | null> {
        return await this.devicesRepository.findOne({
            where: { deviceId },
        });
    }

    async update(deviceId: string, updateDeviceDto: CreateDeviceDto): Promise<Device> {
        const existingDevice = await this.findByDeviceId(deviceId);
        if (!existingDevice) {
            throw new Error(`Device with ID ${deviceId} not found`);
        }

        const updated = this.devicesRepository.merge(existingDevice, updateDeviceDto);
        return await this.devicesRepository.save(updated);
    }

    async findAll(): Promise<Device[]> {
        return this.devicesRepository.find();
    }
}
