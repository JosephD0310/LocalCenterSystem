import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Device {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    serialNumber: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    deviceId: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    room: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    hostname: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    publicIp: string;

    @Column({ type: 'json', nullable: true })
    ipAddress: string[];

    @Column({ type: 'json', nullable: true })
    macAddress: string[];

    @Column({ type: 'json', nullable: true })
    cpu: any;

    @Column({ type: 'json', nullable: true })
    ram: any;

    @Column({ type: 'json', nullable: true })
    diskDrive: any;

    @Column({ type: 'json', nullable: true })
    logicalDisks: any[];

    @Column({ type: 'json', nullable: true })
    firewalls: any[];

    @CreateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: true })
    updatedAt: Date;

    @Column({ type: 'varchar', length: 50, nullable: true })
    status: string;
}
