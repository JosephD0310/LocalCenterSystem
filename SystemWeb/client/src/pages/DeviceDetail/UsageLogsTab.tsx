import { useEffect, useState } from 'react';
import useFetch from '../../services/hooks/useFetch';
import { DeviceData } from '../../types/devicedata';
import useSocket from '../../services/hooks/useSocket';
import dayjs from 'dayjs';
import Status from '../../components/Status';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

type UsageLogsProps = {
    serialNumber: string;
};
function UsageLogsTab({ serialNumber }: UsageLogsProps) {
    const { data, loading } = useFetch<DeviceData[]>(`/devices/usage-logs/${serialNumber}`);

    const [logs, setLogs] = useState<DeviceData[]>([]);
    const {data: mqttData} = useSocket();

    useEffect(() => {
        if (data) {
            const latest30 = data.slice(0, 30);
            setLogs(latest30);
        }
    }, [data]);

    useEffect(() => {
        if (mqttData && mqttData.serialNumber === serialNumber) {
            setLogs((prevLogs) => {
                const updatedLogs = [mqttData, ...prevLogs];
                return updatedLogs.slice(0, 30);
            });
        }
    }, [mqttData]);

    return (
        <div className="overflow-auto shadow rounded-lg max-h-[250px]">
            <table className="bg-white min-w-full text-left text-gray-700">
                <thead className="bg-[#85CC16] text-white font-semibold sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-4">Time</th>
                        <th className="px-4 py-4">CPU (%)</th>
                        <th className="px-4 py-4">RAM (GB)</th>
                        <th className="px-4 py-4">Disk (GB)</th>
                        <th className="px-4 py-4">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {loading
                        ? 'Loading please wait...'
                        : logs.map((log, index) => {
                              const cpuInUse = log.cpu.usage;
                              const ramInUse = (log.ram.total * 1024 - log.ram.available) / 1024;
                              const diskInUse = log.diskDrive.used;
                              return (
                                  <tr key={index} className={` hover:bg-gray-50 transition-colors duration-200`}>
                                      <td className="px-4 py-4 whitespace-nowrap flex flex-row items-center gap-3">
                                          <p>{dayjs(log.updatedAt).format('DD/MM/YYYY')}</p>
                                          <FontAwesomeIcon className="text-xl" icon={faClock} color="#85CC16" />
                                          <p>{dayjs(log.updatedAt).format('HH:mm:ss')}</p>
                                      </td>
                                      <td className="px-4 py-4">{cpuInUse.toFixed(1)}</td>
                                      <td className="px-4 py-4">
                                          {ramInUse.toFixed(1)} / {log.ram.total}
                                      </td>
                                      <td className="px-4 py-4">
                                          {diskInUse.toFixed(1)} / {log.diskDrive.size}
                                      </td>
                                      <td className="px-4 py-4">
                                          <Status option='bg' content={log.status} />
                                      </td>
                                  </tr>
                              );
                          })}
                </tbody>
            </table>
        </div>
    );
}

export default UsageLogsTab;
