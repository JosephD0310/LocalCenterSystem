import { IsArray, IsDate, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  uuid: string;

  @IsNumber()
  deviceId: number;

  @IsString()
  room: string;

  @IsString()
  hostname: string;

  @IsArray()
  ipAddress: string[];

  @IsArray()
  macAddress: string[];

  @IsObject()
  cpu: {
    Model: string;
    Manufacturer: string;
    NumberOfCores: number;
    ThreadCount: number;
    MaxClockSpeedMHz: number;
    Architecture: number;
    Caption: string;
  };

  @IsNumber()
  ram: number;

  @IsArray()
  drives: {
    DeviceID: string;
    VolumeName: string;
    FileSystem: string;
    Size: number;
    FreeSpace: number;
  }[];

  @IsArray()
  firewalls: {
    ProfileName: string;
    Enabled: boolean;
  }[]
}
