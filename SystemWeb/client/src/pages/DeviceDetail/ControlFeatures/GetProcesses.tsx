import { useEffect, useState } from 'react';
import { faChevronDown, faChevronUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useSocket from '../../../services/hooks/useSocket';

interface Process {
    name: string;
    pid: string;
    memUsage: string;
}

type GetProcessProps = {
    serialNumber: string;
};

function GetProcesses({ serialNumber }: GetProcessProps) {
    const [sortField, setSortField] = useState<'name' | 'memUsage'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [deviceProcess, setDeviceProcess] = useState<Process[]>();
    const [selectedProcess, setSelectedProcess] = useState<{ name: string; pid: string }>({ name: '', pid: '' });
    const [showPopup, setShowPopup] = useState(false);
    const [waitingKill, setWaitingKill] = useState(false);

    const { controlReq, response } = useSocket();

    useEffect(() => {
        if (response && response.serial === serialNumber) {
            if (response.response.action === 'GetProcesses') {
                let result = JSON.parse(response.response.result);
                const processes: Process[] = result.map((item: { [x: string]: any }) => ({
                    name: item['Image Name'],
                    pid: parseInt(item['PID']),
                    memUsage: item['Mem Usage'],
                }));
                setDeviceProcess(processes);
            }
        }
    }, [response]);

    // Theo dõi xem selectedProcess có còn tồn tại không
    useEffect(() => {
        if (selectedProcess.pid && deviceProcess) {
            const isStillRunning = deviceProcess.some(
                proc => proc.pid.toString() === selectedProcess.pid.toString()
            );

            if (!isStillRunning && showPopup) {
                setShowPopup(false);
                setSelectedProcess({ name: '', pid: '' });
                setWaitingKill(false);
            }
        }
    }, [deviceProcess, selectedProcess, showPopup]);

    if (!deviceProcess) {
        return <p>Đang tải dữ liệu...</p>;
    }

    const parseMemUsage = (memUsage: string): number => {
        return parseInt(memUsage.replace(/[^\d]/g, '')) || 0;
    };

    const sortedProcesses = [...deviceProcess].sort((a, b) => {
        if (sortField === 'name') {
            return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortField === 'memUsage') {
            return sortOrder === 'asc'
                ? parseMemUsage(a.memUsage) - parseMemUsage(b.memUsage)
                : parseMemUsage(b.memUsage) - parseMemUsage(a.memUsage);
        }

        return 0;
    });

    const toggleSort = (field: 'name' | 'memUsage') => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const handleDeleteConfirm = () => {
        setWaitingKill(true);
        if (selectedProcess) {
            const payload = {
                serialNumber: response.serial,
                control: {
                    action: 'KillProcess',
                    param: selectedProcess.name.replace(/\.exe$/, ''),
                },
            };
            controlReq(payload);
            console.log(`Xoá tiến trình: ${selectedProcess.name}`);
        }
    };

    return (
        <div>
            {sortedProcesses.length === 0 ? (
                <p>Không có tiến trình nào có tiêu đề cửa sổ.</p>
            ) : (
                <div className="overflow-auto shadow rounded-lg max-h-[190px]">
                    <table className="bg-white min-w-full text-left text-gray-700">
                        <thead className="bg-[#85CC16] text-white font-semibold sticky top-0 z-10">
                            <tr>
                                <th
                                    className="px-4 py-4 cursor-pointer flex flex-row gap-3 items-center"
                                    onClick={() => toggleSort('name')}
                                >
                                    Process Name ({sortedProcesses.length})
                                    {sortField === 'name' &&
                                        (sortOrder === 'asc' ? (
                                            <FontAwesomeIcon icon={faChevronUp} />
                                        ) : (
                                            <FontAwesomeIcon icon={faChevronDown} />
                                        ))}
                                </th>
                                <th className="px-4 py-4 text-right">PID</th>
                                <th
                                    className="px-4 py-4 justify-end cursor-pointer flex flex-row gap-3 items-center"
                                    onClick={() => toggleSort('memUsage')}
                                >
                                    Mem Usage
                                    {sortField === 'memUsage' &&
                                        (sortOrder === 'asc' ? (
                                            <FontAwesomeIcon icon={faChevronUp} />
                                        ) : (
                                            <FontAwesomeIcon icon={faChevronDown} />
                                        ))}
                                </th>
                                <th className="px-4 py-4 text-center">Kill Process</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedProcesses.map((process, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-4 py-2">{process.name}</td>
                                    <td className="px-4 py-2 text-right">{process.pid}</td>
                                    <td className="px-4 py-2 text-right">{process.memUsage}</td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            className="bg-[#FF6900] py-0.5 px-3 text-white shadow-xs rounded-2xl cursor-pointer hover:bg-[#F06300] font-semibold"
                                            onClick={() => {
                                                setSelectedProcess({ name: process.name, pid: process.pid });
                                                setShowPopup(true);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showPopup && selectedProcess && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-[400px] text-center">
                        <h2 className="text-4xl font-semibold mb-4">Confirm process kill</h2>
                        {waitingKill ? (
                            <div>Killing this process...</div>
                        ) : (
                            <div>
                                <p className="p-10">
                                    Are you sure you want to kill the process <strong>{selectedProcess.name}</strong>?
                                </p>
                                <div className="mt-6 flex justify-center space-x-3">
                                    <button
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                                        onClick={() => {
                                            setSelectedProcess({ name: '', pid: '' });
                                            setWaitingKill(false);
                                            setShowPopup(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-[#FF6900] text-white rounded hover:bg-[#F06300] cursor-pointer"
                                        onClick={handleDeleteConfirm}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default GetProcesses;
