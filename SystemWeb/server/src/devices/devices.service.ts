import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeviceDto } from './dto/create-device.dto';

@Injectable()
export class DevicesService {
    constructor(
        @InjectRepository(Device)
        private devicesRepo: Repository<Device>,
    ) {}

    async findLatestOfAllDevices(): Promise<Device[]> {
        return this.devicesRepo.query(`
          SELECT d1.*
          FROM device d1
          INNER JOIN (
            SELECT serialNumber, MAX(updatedAt) AS maxUpdatedAt
            FROM device
            GROUP BY serialNumber
          ) d2 ON d1.serialNumber = d2.serialNumber AND d1.updatedAt = d2.maxUpdatedAt
        `);
      }

    async findAllBySerialNumber(serialNumber: string): Promise<Device[]> {
        return this.devicesRepo.find({
            where: { serialNumber },
            order: { updatedAt: 'DESC' }, // Sắp xếp mới nhất trước
        });
    }

    async findLatestBySerialNumber(serialNumber: string): Promise<Device | null> {
        return this.devicesRepo.findOne({
            where: { serialNumber },
            order: { updatedAt: 'DESC' },
        });
    }

    async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
        const device = this.devicesRepo.create(createDeviceDto);
        return await this.devicesRepo.save(device);
    }

    delete(serialNumber: string) {
        return this.devicesRepo.delete(serialNumber);
    }
}
