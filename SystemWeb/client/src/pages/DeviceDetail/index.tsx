import { Link, useLocation } from 'react-router-dom';
import { DeviceData } from '../../types/devicedata';
import config from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faDesktop } from '@fortawesome/free-solid-svg-icons';
import Tabs, { TabItem } from '../../components/Tabs';
import { useEffect, useState } from 'react';
import useSocket from '../../services/hooks/useSocket';
import PerformanceTab from './PerformanceTab';
import UsageLogsTab from './UsageLogsTab';
import Status from '../../components/Status';
import ControlTab from './ControlTab';

function DeviceDetail() {
    const location = useLocation();
    const item = location.state as DeviceData;
    const [device, setDevice] = useState<DeviceData>(item);

    const {data} = useSocket();

    useEffect(() => {
        if (data && data.serialNumber === device.serialNumber) {
            setDevice(data);
        }
    }, [data]);

    return (
        <div className="p-10">
            <div className="flex flex-row items-center gap-5">
                <Link to={config.routes.devices} className="font-medium text-4xl">
                    All Devices
                </Link>
                <FontAwesomeIcon icon={faChevronRight} />
                <h2 className="font-bold text-4xl">{device.hostname}</h2>
                <Status content={device.status} />
            </div>
            <div className="mx-10 mt-10 bg-white rounded-2xl shadow-xs p-10">
                <div className="flex ">
                    <div className="w-1/2 flex flex-row justify-center items-center">
                        <FontAwesomeIcon
                            icon={faDesktop}
                            className="text-[70px] bg-[#78BF18] p-6 rounded-2xl"
                            color="#fff"
                        />
                    </div>
                    <div className="w-1/2 flex flex-row gap-20">
                        <div className="text-gray-600">
                            <p>Name</p>
                            <p>Serial number</p>
                            <p>Public IP</p>
                            <p>Private IP</p>
                            <p>Location</p>
                            <p>Ordinal number</p>
                        </div>
                        <div className="font-semibold">
                            <p>{device.hostname}</p>
                            <p>{device.serialNumber}</p>
                            <p>{device.publicIp}</p>
                            <p>{device.ipAddress[0]}</p>
                            <p>{device.room}</p>
                            <p>{device.deviceId}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <Tabs>
                        <TabItem label="Performance">
                            <PerformanceTab item={device}/>
                        </TabItem>
                        <TabItem label="Control">
                            <ControlTab serialNumber={device.serialNumber}/>
                        </TabItem>
                        <TabItem label="Usage Logs">
                            <UsageLogsTab serialNumber={device.serialNumber} />
                        </TabItem>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default DeviceDetail;
