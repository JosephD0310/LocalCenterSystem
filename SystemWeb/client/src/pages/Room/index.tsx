import { faBolt, faChevronRight, faCircle, faCube } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';
import config from '../../config';
import { useState, useEffect } from 'react';
import useFetch from '../../services/hooks/useFetch';
import useSocket from '../../services/hooks/useSocket';
import { DeviceData } from '../../types/devicedata';
import DeviceCard from '../../components/DeviceCard';
import SideBar from '../../components/SideBar';
import { DoughnutChartv2 } from '../../components/Chart/DoughnutChartv2';
import { Button, Select, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

function Room() {
    const location = useLocation();
    const roomName = location.state;
    const [activeIndex, setActiveIndex] = useState(1);

    const { data: mqttData } = useSocket();
    const { data: initialData, loading } = useFetch<DeviceData[]>('/devices/latest-by-room/' + roomName,
    );

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

    return (
        <div className="p-10 max-h-[calc(100vh-45px)] flex flex-row gap-5">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <div className="flex flex-row items-center gap-5">
                    <Link to={config.routes.devices} className="font-medium text-4xl">
                        Device Management
                    </Link>
                    <FontAwesomeIcon icon={faChevronRight} />
                    <h2 className="font-bold text-4xl">Room {roomName}</h2>
                </div>
                <div className="p-10 flex flex-col gap-5">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 bg-white rounded-2xl shadow-xs p-7 flex flex-col">
                            <h2 className="text-3xl font-bold mb-5 border-b-3 pb-6 border-[#85CC16]">Device Status</h2>
                            <div className="flex flex-row justify-between items-center flex-1">
                                <div className="flex flex-col gap-3 text-gray-600">
                                    <p className="text-2xl">
                                        Room: <span className="font-bold">{roomName}</span>
                                    </p>
                                    <p className="text-2xl">
                                        Supervisor: <span className="font-bold">Admin</span>
                                    </p>
                                    <p className="text-2xl">
                                        Total Devices: <span className="font-bold">{devices.length}</span>
                                    </p>
                                </div>
                                <DoughnutChartv2 total={3} health={1} unhealth={1} />
                                <div className="flex flex-col gap-5 text-2xl text-gray-600 mt-2">
                                    <span className="flex flex-row justify-between items-center">
                                        <div>
                                            <FontAwesomeIcon icon={faCircle} size="2xs" color="#1ED760" /> Healthy{' '}
                                        </div>
                                        <span className="bg-gray-200 px-2 rounded-md font-bold">3</span>
                                    </span>
                                    <span className="flex flex-row gap-5 justify-between items-center">
                                        <div>
                                            <FontAwesomeIcon icon={faCircle} size="2xs" color="#F7CA4C" /> Unhealthy{' '}
                                        </div>
                                        <span className="bg-gray-200 px-2 rounded-md font-bold">3</span>
                                    </span>
                                    <span className="flex flex-row justify-between items-center">
                                        <div>
                                            <FontAwesomeIcon icon={faCircle} size="2xs" color="#D4DBE6" /> Offline{' '}
                                        </div>
                                        <span className="bg-gray-200 px-2 rounded-md font-bold">3</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 bg-white rounded-2xl shadow-xs p-7">
                            <h2 className="text-3xl font-bold mb-5 border-b-3 pb-6 border-[#85CC16]">
                                General Control Panel
                            </h2>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 bg-[#DFEDC8] rounded-2xl p-5 flex flex-col gap-5">
                                    <h3 className="font-bold flex items-center gap-5">
                                        <FontAwesomeIcon icon={faBolt} /> Power Control
                                    </h3>
                                    <Button className="cursor-pointer rounded-2xl bg-[#FF6900] px-4 py-2 text-white data-disabled:bg-gray-500 data-hover:bg-[#ff5900]">
                                        Turn off all
                                    </Button>
                                    <Button className="cursor-pointer rounded-2xl bg-[#85CC16] px-4 py-2 text-white data-active:bg-[#78BF18] data-disabled:bg-gray-500 data-hover:bg-[#78BF18]">
                                        Restart all
                                    </Button>
                                </div>
                                <div className="flex-1 bg-[#DFEDC8] rounded-2xl p-5 flex flex-col gap-5">
                                    <h3 className="font-bold flex items-center gap-5">
                                        <FontAwesomeIcon icon={faCube} /> Room Mode
                                    </h3>
                                    <span className="flex items-center gap-3 text-gray-600 bg-[#F7F9FB] px-4 py-2 rounded-2xl">
                                        <FontAwesomeIcon icon={faCircle} size="2xs" color="#85CC16" /> Current mode:
                                        Study
                                    </span>
                                    <Select
                                        className="bg-white px-4 py-2 rounded-2xl"
                                        name="status"
                                        aria-label="Project status"
                                    >
                                        <option value="study">Study – Internet Enabled</option>
                                        <option value="exam">Exam - Internet Disabled</option>
                                        <option value="TSAexam">TSA Exam</option>
                                    </Select>
                                    <Button className="cursor-pointer rounded-2xl bg-[#85CC16] px-4 py-2 text-white data-active:bg-[#78BF18] data-disabled:bg-gray-500 data-hover:bg-[#78BF18]">
                                        Apply Mode
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-xs">
                        <div>
                            <TabGroup>
                                <div className="text-3xl font-bold p-5 border-b-3 border-[#85CC16] flex flex-col gap-5 items-center bg-[#DFEDC8]">
                                    <h2 className="font-bold text-3xl">Devices List</h2>
                                    <TabList className="text-2xl bg-white inline-flex rounded-full p-2 shadow-xs">
                                        <Tab
                                            className={`min-w-[100px] rounded-full cursor-pointer p-3 ${
                                                1 === activeIndex
                                                    ? 'bg-[#85CC16] text-white font-semibold'
                                                    : 'text-gray-500'
                                            }`}
                                            onClick={() => setActiveIndex(1)}
                                        >
                                            All
                                        </Tab>
                                        <Tab
                                            className={`min-w-[100px] rounded-full cursor-pointer p-3 ${
                                                2 === activeIndex
                                                    ? 'bg-[#85CC16] text-white font-semibold'
                                                    : 'text-gray-500'
                                            }`}
                                            onClick={() => setActiveIndex(2)}
                                        >
                                            <span className="flex flex-row justify-between items-center">
                                                <div>Healthy </div>
                                                <span className="text-gray-500 bg-gray-200 px-2 rounded-md font-bold">3</span>
                                            </span>
                                        </Tab>
                                        <Tab
                                            className={`min-w-[100px] rounded-full cursor-pointer p-3 ${
                                                3 === activeIndex
                                                    ? 'bg-[#85CC16] text-white font-semibold'
                                                    : 'text-gray-500'
                                            }`}
                                            onClick={() => setActiveIndex(3)}
                                        >
                                            <span className="flex flex-row gap-5 justify-between items-center">
                                                <div>Unhealthy </div>
                                                <span className="text-gray-500 bg-gray-200 px-2 rounded-md font-bold">3</span>
                                            </span>
                                        </Tab>
                                    </TabList>
                                </div>
                                {activeIndex !== 0 && (
                                    <TabPanels className="p-5">
                                        <TabPanel className="flex flex-wrap gap-5">
                                            {loading
                                                ? 'Loading please wait...'
                                                : devices.map((item) => (
                                                      <DeviceCard key={item.serialNumber} item={item} />
                                                  ))}
                                        </TabPanel>
                                        <TabPanel className="flex flex-wrap gap-5">
                                            {loading
                                                ? 'Loading please wait...'
                                                : devices.map((item) => (
                                                      <DeviceCard key={item.serialNumber} item={item} />
                                                  ))}
                                        </TabPanel>
                                        <TabPanel className="flex flex-wrap gap-5">
                                            {loading
                                                ? 'Loading please wait...'
                                                : devices.map((item) => (
                                                      <DeviceCard key={item.serialNumber} item={item} />
                                                  ))}
                                        </TabPanel>
                                    </TabPanels>
                                )}
                            </TabGroup>
                        </div>
                    </div>
                </div>
            </div>
            <div className="">
                <SideBar />
            </div>
        </div>
    );
}

export default Room;
