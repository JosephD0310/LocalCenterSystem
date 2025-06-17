import { faArrowTrendDown, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SystemPerformance() {
    return (
        <div className='flex gap-10'>
            <div className="flex-1 font-bold text-gray-700 ">
                <div className='flex items-center justify-between mb-4'>
                    <span>Average CPU</span>
                    <span className='text-red-500'>
                        67% <FontAwesomeIcon icon={faArrowTrendUp} />
                    </span>
                </div>
                <div className='flex items-center justify-between mb-4'>
                    <span>Average RAM</span>
                    <span className='text-green-500'>
                        67% <FontAwesomeIcon icon={faArrowTrendDown} />
                    </span>
                </div>
                <div className='flex items-center justify-between mb-4'>
                    <span>Disk Usage</span>
                    <span className='text-red-500'>
                        67% <FontAwesomeIcon icon={faArrowTrendUp} />
                    </span>
                </div>
            </div>
        </div>
    );
}

export default SystemPerformance;
