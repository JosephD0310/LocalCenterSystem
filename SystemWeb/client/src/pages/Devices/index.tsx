import { useEffect, useState } from 'react';
import DeviceCard from '../../components/DeviceCard';
import useFetch from '../../services/hooks/useFetch';
import useSocket from '../../services/hooks/useSocket';
import { DeviceData } from '../../types/devicedata';

function Devices() {
    const socketData = useSocket();
    const { data: initialData, loading } = useFetch<DeviceData[]>('http://localhost:3000/devices');

    const [devices, setDevices] = useState<DeviceData[]>([]);

    // Load dữ liệu từ DB ban đầu
    useEffect(() => {
        if (initialData) {
            setDevices(initialData);
        }
    }, [initialData]);

    // Khi nhận dữ liệu realtime từ socket
    useEffect(() => {
        if (socketData) {
            setDevices(prevDevices => {
                const index = prevDevices.findIndex(d => d.uuid === socketData.uuid);

                if (index !== -1) {
                    // Đã tồn tại -> cập nhật thông tin
                    const updated = [...prevDevices];
                    updated[index] = socketData;
                    return updated;
                } else {
                    // Thiết bị mới -> thêm vào danh sách
                    return [...prevDevices, socketData];
                }
            });
        }
    }, [socketData]);

    return (
        <div className="p-10">
            <h2 className="font-bold text-4xl">All Devices</h2>
            <div className="flex flex-wrap gap-5 p-10">
                {loading ? (
                    'Loading please wait...'
                ) : (
                    devices.map((item) => <DeviceCard key={item.uuid} item={item} />)
                )}
            </div>
        </div>
    );
}

export default Devices;
