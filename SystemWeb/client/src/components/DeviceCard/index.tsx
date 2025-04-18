import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Status from '../Status';
import ProgressBar from '../ProgressBar';

function DeviceCard() {
    return (
        <div className="bg-white w-[300px] rounded-2xl shadow-xs px-7 py-5">
            <div className="flex flex-col gap-5">
                <div className="flex flex-row gap-5 items-center">
                    <FontAwesomeIcon icon={faDesktop} className="text-4xl bg-[#78BF18] p-4 rounded-2xl" color='#fff'/>
                    <div className="w-full">
                        <h3 className="text-3xl font-bold mb-2">Hostname</h3>
                        <div className="w-full flex flex-row justify-between items-center">
                            <p className="text-2xl text-gray-600">192.168.1.1</p>
                            <Status content="healthy" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 py-4 border-y border-gray-400 text-gray-600 text-xl">
                    <div>
                        <div className="flex flex-row justify-between">
                            <p>CPU</p>
                            <p>50%</p>
                        </div>
                        <ProgressBar value={50} />
                    </div>
                    <div>
                        <div className="flex flex-row justify-between">
                            <p>Memory ・ 6GB / 8GB</p>
                            <p>{Math.floor((6 / 8) * 100)}%</p>
                        </div>
                        <ProgressBar value={(6 / 8) * 100} />
                    </div>
                    <div>
                        <div className="flex flex-row justify-between">
                            <p>Disk ・ 101GB / 256GB</p>
                            <p>{Math.floor((101 / 256) * 100)}%</p>
                        </div>
                        <ProgressBar value={(101 / 256) * 100} />
                    </div>
                </div>
                <div>
                    <p className="text-2xl text-gray-600">Location: B1-204</p>
                    <p className="text-2xl text-gray-600">Last updated: 34 seconds ago</p>
                </div>
            </div>
        </div>
    );
}

export default DeviceCard;
