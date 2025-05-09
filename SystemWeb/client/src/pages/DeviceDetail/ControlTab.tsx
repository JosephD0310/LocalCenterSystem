import { faPowerOff, faRotateRight, faShieldHalved, faTasks } from '@fortawesome/free-solid-svg-icons';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import Shutdown from './ControlFeatures/Shutdown';
import Restart from './ControlFeatures/Restart';
import GetProcesses from './ControlFeatures/GetProcesses';
import Firewall from './ControlFeatures/Firewall';
import useSocket from '../../services/hooks/useSocket';

type ControlTabProps = {
    serialNumber: string;
};

function ControlTab({ serialNumber }: ControlTabProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const { controlReq } = useSocket();

    const handleGetProcesses = () => {
        setActiveIndex(3);
        const payload = {
            serialNumber: serialNumber,
            control: {
                action: 'GetProcesses',
            },
        };
        controlReq(payload);
    };

    return (
        <TabGroup className="flex flex-col gap-10">
            <TabList className="flex flex-row justify-around text-2xl">
                <Tab
                    className={`shadow-xs rounded-3xl cursor-pointer p-5 ${
                        1 === activeIndex
                            ? 'border-[#78BF18] bg-orange-500 text-white font-semibold'
                            : 'text-orange-500 bg-white hover:bg-gray-50 font-semibold'
                    }`}
                    onClick={() => setActiveIndex(1)}
                >
                    <div className="flex flex-row gap-5 items-center">
                        <FontAwesomeIcon icon={faPowerOff} className="text-3xl" />
                        <span>Shutdown</span>
                    </div>
                </Tab>
                <Tab
                    className={`shadow-xs rounded-3xl cursor-pointer p-5 ${
                        2 === activeIndex
                            ? 'bg-[#85CC16] text-white font-semibold'
                            : 'text-[#85CC16] bg-white hover:bg-gray-50 font-semibold'
                    }`}
                    onClick={() => setActiveIndex(2)}
                >
                    <div className="flex flex-row gap-5 items-center">
                        <FontAwesomeIcon icon={faRotateRight} className="text-4xl" />
                        <span>Restart</span>
                    </div>
                </Tab>
                <Tab
                    className={`shadow-xs rounded-3xl cursor-pointer p-5 ${
                        3 === activeIndex
                            ? 'bg-[#FFCA22] text-white font-semibold'
                            : 'text-[#FFCA22] bg-white hover:bg-gray-50 font-semibold'
                    }`}
                    onClick={handleGetProcesses}
                >
                    <div className="flex flex-row gap-5 items-center">
                        <FontAwesomeIcon icon={faTasks} className="text-4xl" />
                        <span>Get Processes</span>
                    </div>
                </Tab>
                <Tab
                    className={`shadow-xs rounded-3xl cursor-pointer p-5 ${
                        4 === activeIndex
                            ? 'bg-[#0078D7] text-white font-semibold'
                            : 'text-[#0078D7] bg-white hover:bg-gray-50 font-semibold'
                    }`}
                    onClick={() => setActiveIndex(4)}
                >
                    <div className="flex flex-row gap-5 items-center">
                        <FontAwesomeIcon icon={faShieldHalved} className="text-4xl" />
                        <span>Firewall</span>
                    </div>
                </Tab>
            </TabList>
            {activeIndex !== 0 && (
                <TabPanels >
                    <TabPanel className="bg-white p-10 rounded-xl shadow-md min-w-[200px]">
                        <Shutdown />
                    </TabPanel>
                    <TabPanel className="bg-white p-10 rounded-xl shadow-md min-w-[200px]">
                        <Restart />
                    </TabPanel>
                    <TabPanel>
                        <GetProcesses serialNumber={serialNumber} />
                    </TabPanel>
                    <TabPanel className="bg-white p-10 rounded-xl shadow-md min-w-[200px]">
                        <Firewall />
                    </TabPanel>
                </TabPanels>
            )}
        </TabGroup>
    );
}

export default ControlTab;
