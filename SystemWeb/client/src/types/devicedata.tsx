export type DeviceData = {
    id: number;
    deviceId: number;
    room: string;
    hostname: string;
    ipAddresses: string[];
    macAddresses: string[];
    cpu: {
        Model: string;
        Manufacturer: string;
        NumberOfCores: number;
        ThreadCount: number;
        MaxClockSpeedMHz: number;
        Architecture: number;
        Caption: string;
    };
    ram: number; // GB
    drives: {
        DeviceID: string;
        VolumeName: string;
        FileSystem: string;
        Size: number; // bytes
        FreeSpace: number; // bytes
    }[];
    firewalls: {
        ProfileName: 'Domain' | 'Private' | 'Public' | string;
        Enabled: boolean;
    }[];
    updatedAt: string;
};
