import { faLeaf, faMicrochip, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProgressBar from '../ProgressBar';

function RoomOverview() {
    return (
        <div className="bg-white min-w-[300px] rounded-2xl shadow-md px-7 py-5 border-l-4 border-[#85CC16] transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between text-black">
                    <div className="text-3xl mb-2">
                        ROOM <span className="font-bold bg-[#85CC16] text-white px-3 rounded-md">B1-404</span>
                    </div>
                    <div className="relative inline-block">
                        <FontAwesomeIcon icon={faTriangleExclamation} color="#F7CA4C" size="lg" />
                        <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow">
                            0
                        </span>
                    </div>
                </div>
                <div>
                    <div className="flex flex-row justify-between">
                        <p>
                            <FontAwesomeIcon icon={faLeaf} color="#86CC16" /> Total Health
                        </p>
                        <p>80%</p>
                    </div>
                    <ProgressBar value={80} />
                </div>
                <div className='flex flex-row justify-between items-center text-gray-600 bg-[#DFEDC8] rounded-lg px-4 py-2'>
                    <span className='font-bold'>
                        <FontAwesomeIcon icon={faMicrochip} /> CPU
                    </span>
                    <span className='text-red-700 font-bold'>90%</span>
                </div>
            </div>
        </div>
    );
}

export default RoomOverview;
