import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Status from '../Status';
import ProgressBar from '../ProgressBar';
import { DeviceData } from '../../types/devicedata';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import config from '../../config';

type DeviceCardProps = {
    item: DeviceData;
};

function DeviceCard({ item }: DeviceCardProps) {
    const checkDeviceState = (updatedAt: string) => {
        const currentTime = new Date().getTime();
        const lastUpdateDate = new Date(updatedAt).getTime();
        const timeDifference = currentTime - lastUpdateDate; // Tính chênh lệch thời gian (ms)
        const timeLimit = 1.5 * 60 * 1000; 

        if (timeDifference > timeLimit) {
            return 'offline';
        }
        return 'online';
    };

    const cpuInUse = item.cpu.usage;
    const ramInUse = ((item.ram.total * 1024 - item.ram.available) / 1024 / item.ram.total) * 100;
    const diskInUse = (item.diskDrive.used / item.diskDrive.size) * 100;

    let deviceState = item.status

    item.status = checkDeviceState(item.updatedAt) === 'offline' ? 'offline' : deviceState;

    return (
        <Link key={item.serialNumber} to={config.routes.generateDeviceDetail(item.deviceId)} state={item}>
            <div className="bg-white w-[300px] rounded-2xl shadow-sm px-7 py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-row gap-5 items-center">
                        <FontAwesomeIcon
                            icon={faDesktop}
                            className="text-4xl bg-[#78BF18] p-4 rounded-2xl"
                            color="#fff"
                        />
                        <div className="w-full">
                            <h3 className="text-2xl font-bold mb-2">{item.hostname}</h3>
                            <div className="w-full flex flex-row justify-between items-center">
                                <p className="text-xl text-gray-600">{item.ipAddress[0]}</p>
                                <Status content={item.status} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 py-4 border-y border-gray-400 text-gray-600 text-xl">
                        <div>
                            <div className="flex flex-row justify-between">
                                <p>CPU</p>
                                <p>{cpuInUse}%</p>
                            </div>
                            <ProgressBar value={cpuInUse} />
                        </div>
                        <div>
                            <div className="flex flex-row justify-between">
                                <p>
                                    Memory ・ {((item.ram.total * 1024 - item.ram.available) / 1024).toFixed(1)}GB /{' '}
                                    {item.ram.total}GB
                                </p>
                                <p>{Math.floor(ramInUse)}%</p>
                            </div>
                            <ProgressBar value={ramInUse} />
                        </div>
                        <div>
                            <div className="flex flex-row justify-between">
                                <p>
                                    Disk ・ {(item.diskDrive.used).toFixed(1)}GB / {item.diskDrive.size}GB
                                </p>
                                <p>{Math.floor(diskInUse)}%</p>
                            </div>
                            <ProgressBar value={diskInUse} />
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl text-gray-600">
                            Location: {item.room}
                        </p>
                        <p className="text-2xl text-gray-600">
                            Number: {item.deviceId}
                        </p>
                        <p className="text-2xl text-gray-600">
                            Last updated: {dayjs(item.updatedAt).format('DD/MM/YYYY HH:mm')}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default DeviceCard;
