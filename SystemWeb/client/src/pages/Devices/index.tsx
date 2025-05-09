import { useEffect, useState } from 'react';
import DeviceCard from '../../components/DeviceCard';
import useFetch from '../../services/hooks/useFetch';
import useSocket from '../../services/hooks/useSocket';
import { DeviceData } from '../../types/devicedata';

function Devices() {
    const {data: mqttData} = useSocket();
    const { data: initialData, loading } = useFetch<DeviceData[]>('http://localhost:3000/devices/latest-all');

    const [devices, setDevices] = useState<DeviceData[]>([]);

    // Load dữ liệu từ DB ban đầu
    useEffect(() => {
        if (initialData) {
            setDevices(initialData);
        }
    }, [initialData]);

    // Khi nhận dữ liệu realtime từ socket
    useEffect(() => {
        if (mqttData) {
            setDevices(prevDevices => {
                const index = prevDevices.findIndex(d => d.serialNumber === mqttData.serialNumber);

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

    return (
        <div className="p-10">
            <h2 className="font-bold text-4xl">All Devices</h2>
            <div className="flex flex-wrap gap-5 p-10">
                {loading ? (
                    'Loading please wait...'
                ) : (
                    devices.map((item) => <DeviceCard key={item.serialNumber} item={item} />)
                )}
            </div>
        </div>
    );
}

export default Devices;
