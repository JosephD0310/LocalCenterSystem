import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity()
export class Device {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    uuid: string;

    @Column()
    deviceId: number;

    @Column()
    room: string;

    @Column()
    hostname: string;

    @Column('json')
    ipAddress: string[]; // IPv4 và IPv6

    @Column('json')
    macAddress: string[];

    @Column('json')
    cpu: {
        Model: string;
        Manufacturer: string;
        NumberOfCores: number;
        ThreadCount: number;
        MaxClockSpeedMHz: number;
        Architecture: number;
        Caption: string;
    };

    @Column()
    ram: number; // GB

    @Column('json')
    drives: {
        DeviceID: string;
        VolumeName: string;
        FileSystem: string;
        Size: number;
        FreeSpace: number;
    }[];

    @Column('json')
    firewalls: {
        ProfileName: string;
        Enabled: boolean;
    }[];

    @UpdateDateColumn()
    updatedAt: Date;
}
