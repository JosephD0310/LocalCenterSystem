import { Link } from 'react-router-dom';
import config from '../../config';
import { RoomData } from '../../types/roomdata';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

type RoomCardProps = {
    item: RoomData;
};

function RoomCard({ item }: RoomCardProps) {
    return (
        <Link key={item.roomName} to={config.routes.generateRoom(item.roomName)} state={item.roomName}>
            <div className="bg-white min-w-[300px] rounded-2xl shadow-xs px-7 py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex flex-row gap-7 ">
                    <img className='' src="./room.svg" alt="" />
                    <div className="w-full">
                        <h3 className="py-3 border-b-2 border-[#85CC16] mb-3">
                            <div className="text-3xl mb-2">
                                ROOM <span className="font-bold">{item.roomName}</span>
                            </div>
                            <p className="text-2xl text-gray-600 ">Supervisor: <span className='font-bold'>{item.managerName? item.managerName : 'Admin'}</span></p>
                        </h3>
                        <p className="text-2xl text-gray-600 mb-2 font-bold">Devices: {item.deviceCount}</p>
                        <div className="flex flex-row gap-5 text-2xl text-gray-600 mt-2">
                            <span>
                                <FontAwesomeIcon icon={faCircle} size="2xs" color="#1ED760" /> Healthy <span className='bg-gray-200 px-2 rounded-md font-bold'>{item.healthyCount}</span>
                            </span>
                            <span>
                                <FontAwesomeIcon icon={faCircle} size="2xs" color="#F7CA4C" /> Unhealthy <span className='bg-gray-200 px-2 rounded-md font-bold'>{item.unhealthyCount}</span>
                            </span>
                            <span>
                                <FontAwesomeIcon icon={faCircle} size="2xs" color="#D4DBE6" /> Offline <span className='bg-gray-200 px-2 rounded-md font-bold'>{item.offlineCount}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default RoomCard;
