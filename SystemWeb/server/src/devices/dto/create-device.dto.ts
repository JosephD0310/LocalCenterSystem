import { IsString, IsArray, IsObject } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  serialNumber: string;

  @IsString()
  deviceId: string;

  @IsString()
  room: string;

  @IsString()
  hostname: string;

  @IsString()
  publicIp: string;
  
  @IsArray()
  ipAddress: string[];

  @IsArray()
  macAddress: string[];

  @IsObject()
  cpu: any;

  @IsObject()
  ram: any;

  @IsObject()
  diskDrive: any;

  @IsArray()
  logicalDisks: any[];

  @IsArray()
  firewalls: any[];

  @IsString()
  status: string;
}
