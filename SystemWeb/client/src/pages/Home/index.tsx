import {
    faBolt,
    faComputer,
    faLayerGroup,
    faLeaf,
    faLinkSlash,
    faServer,
    faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RoomOverview from '../../components/RoomOverview';
import RecentAlert from './RecentAlert';
import SystemPerformance from './SystemPerformance';
import useSocket from '../../services/hooks/useSocket';
import { useState, useEffect } from 'react';
import useFetch from '../../services/hooks/useFetch';
import { DeviceData } from '../../types/devicedata';
import { RoomData } from '../../types/roomdata';
import Carousel from '../../components/Carousel';

const mockAlerts: { room: string; deviceName: string; message: string; time: string; }[] = [
    
];

function Home() {
    const { data: mqttData } = useSocket();
    const { data: initialData, loading } = useFetch<DeviceData[]>('/devices/latest-all');

    const [devices, setDevices] = useState<DeviceData[]>([]);
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [healthy, setHealthy] = useState<number>(0);
    const [offline, setOffline] = useState<number>(0);
    const [cpuAvg, setCpuAvg] = useState<number>(0);
    const [ramAvg, setRamAvg] = useState<number>(0);
    const [diskAvg, setDiskAvg] = useState<number>(0);
    // Tính tổng và đếm thiết bị hợp lệ
    let totalCpu = 0;
    let totalRam = 0;
    let totalDisk = 0;
    let count = 0;

    // Load dữ liệu từ DB ban đầu
    useEffect(() => {
        if (initialData) {
            setDevices(initialData);
        }
    }, [initialData]);

    // Khi nhận dữ liệu realtime từ socket
    useEffect(() => {
        if (mqttData) {
            setDevices((prevDevices) => {
                const index = prevDevices.findIndex((d) => d.serialNumber === mqttData.serialNumber);

                if (index !== -1) {
                    // Đã tồn tại -> cập nhật thông tin
                    const updated = [...prevDevices];
                    updated[index] = mqttData;
                    return updated;
                } else {
                    // Thiết bị mới -> thêm vào danh sách
                    return [...prevDevices, mqttData];
                }
            });
        }
    }, [mqttData]);

    useEffect(() => {
        const roomMap: Record<string, RoomData> = {};

        devices.forEach((device) => {
            const checkDeviceState = (updatedAt: string) => {
                const currentTime = new Date().getTime();
                const lastUpdateDate = new Date(updatedAt).getTime();
                const timeDifference = currentTime - lastUpdateDate; // Tính chênh lệch thời gian (ms)
                const tenMinutesInMs = 3 * 60 * 1000; // 10 phút tính theo ms

                if (timeDifference > tenMinutesInMs) {
                    return 'offline';
                }
                return 'online';
            };

            let deviceState = device.status;
            device.status = checkDeviceState(device.updatedAt) === 'offline' ? 'offline' : deviceState;

            const roomName = device.room || 'Unknown';

            if (!roomMap[roomName]) {
                roomMap[roomName] = {
                    roomName,
                    deviceCount: 0,
                    healthyCount: 0,
                    unhealthyCount: 0,
                    offlineCount: 0,
                };
            }

            roomMap[roomName].deviceCount += 1;

            switch (device.status) {
                case 'healthy':
                    roomMap[roomName].healthyCount += 1;
                    break;
                case 'unhealthy':
                    roomMap[roomName].unhealthyCount += 1;
                    break;
                case 'offline':
                    roomMap[roomName].offlineCount += 1;
                    break;
                default:
                    break;
            }

            // Tính toán tổng CPU, RAM, Disk trung bình
            try {
                const cpuInUse = device.cpu.usage;
                const ramInUse = ((device.ram.total * 1024 - device.ram.available) / 1024 / device.ram.total) * 100;
                const diskInUse = (device.diskDrive.used / device.diskDrive.size) * 100;

                // Đảm bảo dữ liệu hợp lệ
                if (!isNaN(cpuInUse) && !isNaN(ramInUse) && !isNaN(diskInUse)) {
                    totalCpu += cpuInUse;
                    totalRam += ramInUse;
                    totalDisk += diskInUse;
                    count++;
                }
            } catch (err) {
                console.warn('Lỗi khi tính toán thiết bị:', device.serialNumber);
            }
        });
        setHealthy(devices.filter((device) => device.status === 'healthy').length);
        setOffline(devices.filter((device) => device.status === 'offline').length);
        setRooms(Object.values(roomMap));
        if (count > 0) {
            setCpuAvg(Math.round(totalCpu / count));
            setRamAvg(Math.round(totalRam / count));
            setDiskAvg(Math.round(totalDisk / count));
        } else {
            setCpuAvg(0);
            setRamAvg(0);
            setDiskAvg(0);
        }
    }, [devices]);
    const roomComponents = rooms.map((room, index) => <RoomOverview key={index} item={room} />);

    return (
        <div className="p-10 overflow-y-auto overflow-x-hidden pr-10 max-h-[calc(100vh-70px)]">
            <h2 className="font-bold text-4xl text-center">System Overview</h2>
            {loading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="w-10 h-10 border-4 border-[#86CC16] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="p-5">
                    <div className="p-8 flex flex-col md:flex-row gap-4 bg-[#86CC16] rounded-full shadow-md shadow-[#86CC16]/50">
                        <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex-1 bg-[#64A30E] text-white py-10 px-15 shadow-2xs rounded-full flex flex-row items-center gap-2 justify-between">
                            <div className="flex flex-col gap-2">
                                <span className="text-3xl">Total Devices</span>
                                <span className="text-5xl font-bold">{devices.length}</span>
                            </div>
                            <FontAwesomeIcon icon={faComputer} size="3x" className="bg-[#86CC16] p-5 rounded-3xl" />
                        </div>
                        <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex-1 bg-[#64A30E] text-white py-10 px-15 shadow-2xs rounded-full flex flex-row items-center gap-2 justify-between">
                            <div className="flex flex-col gap-2">
                                <span className="text-3xl">Total Rooms</span>
                                <span className="text-5xl font-bold">{rooms.length}</span>
                            </div>
                            <FontAwesomeIcon icon={faLayerGroup} size="3x" className="bg-[#86CC16] p-5 rounded-3xl" />
                        </div>
                        <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex-1 bg-[#64A30E] text-white py-10 px-15 shadow-2xs rounded-full flex flex-row items-center gap-2 justify-between">
                            <div className="flex flex-col gap-2">
                                <span className="text-3xl">Healthy Devices</span>
                                <span className="text-5xl font-bold">{healthy}</span>
                            </div>
                            <FontAwesomeIcon icon={faLeaf} size="3x" className="bg-[#86CC16] p-5 rounded-3xl" />
                        </div>
                        <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex-1 bg-[#64A30E] text-white py-10 px-15 shadow-2xs rounded-full flex flex-row items-center gap-2 justify-between">
                            <div className="flex flex-col gap-2">
                                <span className="text-3xl">Offline Devices</span>
                                <span className="text-5xl font-bold">{offline}</span>
                            </div>
                            <FontAwesomeIcon icon={faLinkSlash} size="3x" className="bg-[#86CC16] p-5 rounded-3xl" />
                        </div>
                    </div>
                    <div className="flex-1 bg-white rounded-2xl shadow-xs p-7 mt-10">
                        <h2 className="text-3xl font-bold mb-5 border-b-3 pb-6 border-[#85CC16]">
                            <FontAwesomeIcon icon={faServer} /> Room Status Overview
                        </h2>
                        <div className="relative">
                            <div className="w-full">
                                <Carousel slides={roomComponents} />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 bg-white rounded-2xl shadow-xs p-7 mt-10">
                        <h2 className="text-3xl font-bold mb-5 border-b-3 pb-6 border-[#85CC16]">
                            <FontAwesomeIcon icon={faBolt} /> System Performance
                        </h2>
                        <SystemPerformance cpu={cpuAvg} ram={ramAvg} disk={diskAvg} />
                    </div>
                    <div className="flex-1 bg-white rounded-2xl shadow-xs p-7 mt-10">
                        <h2 className="text-3xl font-bold border-b-3 pb-6 border-[#85CC16]">
                            <FontAwesomeIcon icon={faTriangleExclamation} /> Recent Alerts
                        </h2>
                        <RecentAlert alerts={mockAlerts} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
