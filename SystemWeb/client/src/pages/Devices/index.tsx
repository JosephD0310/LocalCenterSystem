import DeviceCard from '../../components/DeviceCard';
import useSocket from '../../services/hooks/useSocket';

function Devices() {
    const data = useSocket();
    return (
        <div className="p-10">
            <h2 className="font-bold text-4xl">All Devices</h2>
            <div>
                <DeviceCard />
            </div>
            {data ? (
                <div>
                    <p>
                        <strong>ID:</strong> {data.DeviceId}
                    </p>
                    <p>
                        <strong>Hostname:</strong> {data.Hostname}
                    </p>
                    <p>
                        <strong>Room:</strong> {data.Room}
                    </p>
                </div>
            ) : (
                <p>Đang chờ dữ liệu...</p>
            )}
        </div>
    );
}

export default Devices;
