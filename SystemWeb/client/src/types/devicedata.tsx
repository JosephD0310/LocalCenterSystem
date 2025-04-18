export type DeviceData = {
    DeviceId: string;
    Room: string;
    Hostname: string;
    IPAddress: string[];
    MACAddress: string[];
    CPU: {
      Model: string;
      Manufacturer: string;
      NumberOfCores: number;
      ThreadCount: number;
      MaxClockSpeedMHz: number;
      Architecture: number;
      Caption: string;
    };
    RAM: number; // GB
    Drives: {
      DeviceID: string;
      VolumeName: string;
      FileSystem: string;
      Size: number; // bytes
      FreeSpace: number; // bytes
    }[];
    Firewalls: {
      ProfileName: 'Domain' | 'Private' | 'Public' | string;
      Enabled: boolean;
    }[];
  };
  