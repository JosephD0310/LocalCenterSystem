import { useEffect, useState } from 'react';
import DeviceCard from '../../components/DeviceCard';
import useFetch from '../../services/hooks/useFetch';
import useSocket from '../../services/hooks/useSocket';
import { DeviceData } from '../../types/devicedata';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/react';
import { RoomData } from '../../types/roomdata';
import RoomCard from '../../components/RoomCard';

function Devices() {
    const [activeIndex, setActiveIndex] = useState(1);
    const { data: mqttData } = useSocket();
    const { data: initialData, loading } = useFetch<DeviceData[]>('/devices/latest-all');

    const [devices, setDevices] = useState<DeviceData[]>([]);
    const [rooms, setRooms] = useState<RoomData[]>([]);

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
            const roomName = device.room || 'Unknown';

            if (!roomMap[roomName]) {
                roomMap[roomName] = {
                    roomName,
                    deviceCount: 0,
                    healthyCount: 0,
                    unhealthyCount: 0,
                    offlineCount: 0,
                    _cpuTotal: 0,
                    _ramTotal: 0,
                    _diskTotal: 0,
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
        });

        setRooms(Object.values(roomMap));
    }, [devices]);

    return (
        <div className="p-10 overflow-y-auto overflow-x-hidden pr-10 max-h-[calc(100vh-70px)]">
            <h2 className="font-bold text-4xl text-center">Device Management</h2>
            {loading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="w-10 h-10 border-4 border-[#86CC16] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div>
                    <TabGroup>
                        <div className="flex justify-center mt-10 mb-5">
                            <TabList className="text-2xl bg-white inline-flex rounded-full p-2 shadow-xs">
                                <Tab
                                    className={`min-w-[80px] rounded-full cursor-pointer p-3 ${
                                        1 === activeIndex ? 'bg-[#85CC16] text-white font-semibold' : 'text-gray-500'
                                    }`}
                                    onClick={() => setActiveIndex(1)}
                                >
                                    <span>All</span>
                                </Tab>
                                <Tab
                                    className={`min-w-[80px] rounded-full cursor-pointer p-3 ${
                                        2 === activeIndex ? 'bg-[#85CC16] text-white font-semibold' : 'text-gray-500'
                                    }`}
                                    onClick={() => setActiveIndex(2)}
                                >
                                    <span>Room</span>
                                </Tab>
                            </TabList>
                        </div>
                        {activeIndex !== 0 && (
                            <TabPanels className="p-10">
                                <TabPanel className="flex flex-wrap gap-x-15 gap-y-10">
                                    {devices.map((item) => (
                                        <DeviceCard key={item.serialNumber} item={item} />
                                    ))}
                                </TabPanel>
                                <TabPanel className="flex flex-wrap justify-evenly gap-x-15 gap-y-10">
                                    {rooms.map((item) => {
                                        console.log(item.healthyCount);
                                        return <RoomCard key={item.roomName} item={item} />;
                                    })}
                                </TabPanel>
                            </TabPanels>
                        )}
                    </TabGroup>
                </div>
            )}
        </div>
    );
}

export default Devices;
