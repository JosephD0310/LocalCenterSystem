import { faCompactDisc, faLeaf, faMemory, faMicrochip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProgressBar from '../ProgressBar';
import { RoomData } from '../../types/roomdata';

type RoomOverviewProps = {
    item: RoomData;
};

function RoomOverview({ item }: RoomOverviewProps) {
    return (
        <div className="bg-white min-w-[350px] rounded-2xl shadow-md px-7 py-5 border-l-4 border-[#85CC16] transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between text-black">
                    <div className="text-3xl mb-2">
                        ROOM <span className="font-bold bg-[#85CC16] text-white px-3 rounded-md">{item.roomName}</span>
                    </div>
                </div>
                <div>
                    <div className="flex flex-row justify-between">
                        <p>
                            <FontAwesomeIcon icon={faLeaf} color="#86CC16" /> Total Health
                        </p>
                        <p>{Math.round((item.healthyCount / item.deviceCount) * 100)}%</p>
                    </div>
                    <ProgressBar value={(item.healthyCount / item.deviceCount) * 100} />
                </div>
                <div className="flex flex-row justify-between gap-5">
                    <div className="flex-1 flex flex-col justify-between items-center text-gray-800 bg-[#DFEDC8] rounded-lg px-4 py-2">
                        <span className="font-bold">
                            <FontAwesomeIcon icon={faMicrochip} /> CPU
                        </span>
                        <span className="text-red-700 font-bold">{Math.round(item._cpuTotal / item.deviceCount)}%</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-between items-center text-gray-800 bg-[#DFEDC8] rounded-lg px-4 py-2">
                        <span className="font-bold">
                            <FontAwesomeIcon icon={faMemory} /> RAM
                        </span>
                        <span className="text-red-700 font-bold">{Math.round(item._ramTotal / item.deviceCount)}%</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-between items-center text-gray-800 bg-[#DFEDC8] rounded-lg px-4 py-2">
                        <span className="font-bold">
                            <FontAwesomeIcon icon={faCompactDisc} /> Disk
                        </span>
                        <span className="text-red-700 font-bold">
                            {Math.round(item._diskTotal / item.deviceCount)}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoomOverview;
