export type RoomData = {
    roomName: string;
    deviceCount: number;
    healthyCount: number;
    unhealthyCount: number;
    offlineCount: number;
    _cpuTotal: number; // Tổng CPU của các thiết bị trong phòng
    _ramTotal: number; // Tổng RAM của các thiết bị trong phòng 
    _diskTotal: number; // Tổng Disk của các thiết bị trong phòng
    managerName?: string;
};
