export type DeviceData = {
    id: number;
    serialNumber: string;
    deviceId: number;
    room: string;
    hostname: string;
    publicIp: string;
    ipAddress: string[];         
    macAddress: string[];       
    cpu: any;                    
    ram: any;                    
    diskDrive: any;              
    logicalDisks: any[];         
    firewalls: any[];            
    updatedAt: string;            
    status: string;            
  };

