import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  deviceId: string;

  @IsString()
  room: string;

  @IsString()
  hostname: string;

  @IsArray()
  ipAddresses: string[];

  @IsArray()
  macAddresses: string[];

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
  }[];
}
