import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DoughnutChart } from '../../components/Chart/DoughnutChart';
import ProgressBar from '../../components/ProgressBar';
import { DeviceData } from '../../types/devicedata';
import { faCompactDisc, faMemory, faMicrochip } from '@fortawesome/free-solid-svg-icons';
import useSocket from '../../services/hooks/useSocket';
import { useEffect, useState } from 'react';

type PerformanceProps = {
    item: DeviceData;
};

function PerformanceTab({ item }: PerformanceProps) {
    const [device, setDevice] = useState<DeviceData>(item);
    const {data} = useSocket();

    useEffect(() => {
        if (data && data.serialNumber === item.serialNumber) {
            setDevice(data);
        }
    }, [data]);

    const cpuInUse = device.cpu.usage;
    const ramInUse = ((device.ram.total * 1024 - device.ram.available) / 1024 / device.ram.total) * 100;
    const diskInUse = (device.diskDrive.used / device.diskDrive.size) * 100;

    return (
        <div className="flex flex-row gap-5">
            <div className="w-full bg-white rounded-2xl shadow-xs px-7 py-5">
                <div>
                    <div className="pb-5 border-b border-gray-400">
                        <h2 className="text-4xl font-bold">
                            <FontAwesomeIcon icon={faMicrochip} /> CPU
                        </h2>
                        <h2 className="text-2xl text-gray-600">{device.cpu.name}</h2>
                    </div>
                    <div className="flex flex-row justify-between items-center p-10">
                        <div className="flex flex-wrap gap-10">
                            <div>
                                <h3 className="text-2xl text-gray-500">Base Speed</h3>
                                <p className="text-3xl font-semibold">
                                    {(device.cpu.maxClockSpeed / 1000).toFixed(2)} GHz
                                </p>
                            </div>
                            <div>
                                <h3 className="text-2xl text-gray-500">Cores</h3>
                                <p className="text-3xl font-semibold">{device.cpu.numberOfCores}</p>
                            </div>
                            <div>
                                <h3 className="text-2xl text-gray-500">Processors</h3>
                                <p className="text-3xl font-semibold">{device.cpu.threadCount}</p>
                            </div>
                        </div>
                        <DoughnutChart percent={cpuInUse} />
                    </div>
                </div>
            </div>
            <div className="w-full bg-white rounded-2xl shadow-xs px-7 py-5">
                <div>
                    <div className="pb-5 border-b border-gray-400">
                        <h2 className="text-4xl font-bold"><FontAwesomeIcon icon={faMemory} /> Memory</h2>
                        <h2 className="text-2xl text-gray-600">RAM ・ {device.ram.total}GB</h2>
                    </div>
                    <div className="flex flex-row justify-between items-center p-10">
                        <div className="flex flex-wrap gap-x-10">
                            <div>
                                <h3 className="text-2xl text-gray-500">In Use</h3>
                                <p className="text-3xl font-semibold">
                                    {((device.ram.total * 1024 - device.ram.available) / 1024).toFixed(1)} GB
                                </p>
                            </div>
                            <div>
                                <h3 className="text-2xl text-gray-500">Available</h3>
                                <p className="text-3xl font-semibold">{(device.ram.available / 1024).toFixed(1)} GB</p>
                            </div>
                        </div>
                        <DoughnutChart percent={ramInUse}></DoughnutChart>
                    </div>
                </div>
            </div>
            <div className="w-full bg-white rounded-2xl shadow-xs px-7 py-5">
                <div>
                    <div className="pb-5 border-b border-gray-400">
                        <h2 className="text-4xl font-bold"><FontAwesomeIcon icon={faCompactDisc} /> Disk</h2>
                        <h2 className="text-2xl text-gray-600">{device.diskDrive.model}</h2>
                    </div>
                    <div className="flex flex-row justify-between items-center p-10 gap-5">
                        <div className="max-h-52 overflow-y-auto overflow-x-hidden pr-10">
                            {device.logicalDisks.map((disk, index) => {
                                const used = disk.size - disk.freeSpace;
                                const diskInUse = disk.size > 0 ? (used / disk.size) * 100 : 0;

                                return (
                                    <div key={index} className="mb-5">
                                        <div className="text-2xl">
                                            <p className="font-semibold">
                                                {disk.name} {disk.volumeName}
                                            </p>
                                            <p className="text-gray-600 text-xl">
                                                {disk.freeSpace} GB free of {disk.size} GB
                                            </p>
                                        </div>
                                        <ProgressBar value={diskInUse} />
                                    </div>
                                );
                            })}
                        </div>

                        <DoughnutChart percent={diskInUse} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PerformanceTab;
