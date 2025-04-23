import DeviceCard from '../../components/DeviceCard';
import useFetch from '../../services/hooks/useFetch';
import useSocket from '../../services/hooks/useSocket';
import { DeviceData } from '../../types/devicedata';

function Devices() {
    const data_socket = useSocket();
    const { data, loading } = useFetch<DeviceData[]>('http://localhost:3000/devices');
    return (
        <div className="p-10">
            <h2 className="font-bold text-4xl">All Devices</h2>
            <div className='flex flex-wrap gap-5 p-10'>
                {loading ? (
                    'Loading please wait'
                ) : (data && data.map((item) => (<DeviceCard key={item.id} item={item}/>)))}
            </div>
            {data_socket ? (
                <div>
                    <p>
                        <strong>ID:</strong> {data_socket.DeviceId}
                    </p>
                    <p>
                        <strong>UpdateAt:</strong> {data_socket.updateAt}
                    </p>
                    <p>
                        <strong>Room:</strong> {data_socket.Room}
                    </p>
                </div>
            ) : (
                <p>Đang chờ dữ liệu...</p>
            )}
        </div>
    );
}

export default Devices;
