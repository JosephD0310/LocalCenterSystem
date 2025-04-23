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

    findAll() {
        return this.devicesRepo.find();
    }

    findOne(uuid: string) {
        return this.devicesRepo.findOneBy({ uuid });
    }

    create(createDeviceDto: CreateDeviceDto) {
        const device = this.devicesRepo.create(createDeviceDto);
        return this.devicesRepo.save(device);
    }

    async update(uuid: string, dto: CreateDeviceDto) {
        const existing = await this.devicesRepo.findOneBy({ uuid });
        if (!existing) return null;
        const updated = this.devicesRepo.merge(existing, dto);
        return this.devicesRepo.save(updated);
    }

    delete(deviceId: number) {
        return this.devicesRepo.delete(deviceId);
    }
}
