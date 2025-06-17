import {
    faBolt,
    faComputer,
    faLayerGroup,
    faLeaf,
    faServer,
    faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RoomOverview from '../../components/RoomOverview';
import RecentAlert from './RecentAlert';
import SystemPerformance from './SystemPerformance';

const mockAlerts = [
    {
        room: 'B1-401',
        deviceName: 'PC-A01',
        message: 'CPU usage > 90%',
        time: 'Jun 13, 2025, 20:14',
    },
    {
        room: 'B1-401',
        deviceName: 'PC-A01',
        message: 'CPU usage > 90%',
        time: 'Jun 13, 2025, 20:14',
    },
    {
        room: 'B1-401',
        deviceName: 'PC-A01',
        message: 'CPU usage > 90%',
        time: 'Jun 13, 2025, 20:14',
    },
    {
        room: 'B1-401',
        deviceName: 'PC-A01',
        message: 'CPU usage > 90%',
        time: 'Jun 13, 2025, 20:14',
    },
];

function Home() {
    return (
        <div className="p-10 overflow-y-auto overflow-x-hidden pr-10 max-h-[calc(100vh-70px)]">
            <h2 className="font-bold text-4xl text-center">System Overview</h2>
            <div className="p-5">
                <div className="p-8 flex flex-col md:flex-row gap-4 bg-[#86CC16] rounded-full shadow-md shadow-[#86CC16]/50">
                    <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex-1 bg-[#64A30E] text-white py-10 px-15 shadow-2xs rounded-full flex flex-row items-center gap-2 justify-between">
                        <div className="flex flex-col gap-2">
                            <span className="text-3xl">Total Devices</span>
                            <span className="text-5xl font-bold">100</span>
                        </div>
                        <FontAwesomeIcon icon={faComputer} size="3x" className="bg-[#86CC16] p-5 rounded-3xl" />
                    </div>
                    <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex-1 bg-[#64A30E] text-white py-10 px-15 shadow-2xs rounded-full flex flex-row items-center gap-2 justify-between">
                        <div className="flex flex-col gap-2">
                            <span className="text-3xl">Total Rooms</span>
                            <span className="text-5xl font-bold">100</span>
                        </div>
                        <FontAwesomeIcon icon={faLayerGroup} size="3x" className="bg-[#86CC16] p-5 rounded-3xl" />
                    </div>
                    <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex-1 bg-[#64A30E] text-white py-10 px-15 shadow-2xs rounded-full flex flex-row items-center gap-2 justify-between">
                        <div className="flex flex-col gap-2">
                            <span className="text-3xl">Healthy Devices</span>
                            <span className="text-5xl font-bold">100</span>
                        </div>
                        <FontAwesomeIcon icon={faLeaf} size="3x" className="bg-[#86CC16] p-5 rounded-3xl" />
                    </div>
                    <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex-1 bg-[#64A30E] text-white py-10 px-15 shadow-2xs rounded-full flex flex-row items-center gap-2 justify-between">
                        <div className="flex flex-col gap-2">
                            <span className="text-3xl">Recorded Alerts</span>
                            <span className="text-5xl font-bold">100</span>
                        </div>
                        <FontAwesomeIcon
                            icon={faTriangleExclamation}
                            size="3x"
                            className="bg-[#86CC16] p-5 rounded-3xl"
                        />
                    </div>
                </div>
                <div className="flex-1 bg-white rounded-2xl shadow-xs p-7 mt-10">
                    <h2 className="text-3xl font-bold mb-5 border-b-3 pb-6 border-[#85CC16]">
                        <FontAwesomeIcon icon={faServer} /> Room Status Overview
                    </h2>
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row gap-10 text-gray-600">
                            <RoomOverview />
                            <RoomOverview />
                            <RoomOverview />
                            <RoomOverview />
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-white rounded-2xl shadow-xs p-7 mt-10">
                    <h2 className="text-3xl font-bold mb-5 border-b-3 pb-6 border-[#85CC16]">
                        <FontAwesomeIcon icon={faBolt} /> System Performance
                    </h2>
                    <SystemPerformance />
                </div>
                <div className="flex-1 bg-white rounded-2xl shadow-xs p-7 mt-10">
                    <h2 className="text-3xl font-bold border-b-3 pb-6 border-[#85CC16]">
                        <FontAwesomeIcon icon={faTriangleExclamation} /> Recent Alerts
                    </h2>
                    <RecentAlert alerts={mockAlerts} />
                </div>
            </div>
        </div>
    );
}

export default Home;
