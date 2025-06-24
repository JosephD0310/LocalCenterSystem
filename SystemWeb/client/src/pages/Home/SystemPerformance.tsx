import { faArrowTrendDown, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AverageBarChart from './AverageBarChart';

type SystemPerformanceProps = {
    cpu: number;
    ram: number;    
    disk: number;
};

function SystemPerformance({ cpu, ram, disk }: SystemPerformanceProps) {
    return (
        <div className='flex flex-row items-center gap-10 '>
            <div className="flex-1 flex flex-col gap-5 font-bold bg-[#E7F5D3] rounded-2xl px-7 py-5 border-l-4 border-[#85CC16] transition-all duration-300 hover:-translate-y-1">
                <div className='flex items-center justify-between'>
                    <span>Average CPU</span>
                    <span className='text-red-500'>
                        {cpu}% <FontAwesomeIcon icon={faArrowTrendUp} />
                    </span>
                </div>
                <div className='flex items-center justify-between'>
                    <span>Average RAM</span>
                    <span className='text-green-500'>
                        {ram}% <FontAwesomeIcon icon={faArrowTrendDown} />
                    </span>
                </div>
                <div className='flex items-center justify-between'>
                    <span>Average Disk</span>
                    <span className='text-red-500'>
                        {disk}% <FontAwesomeIcon icon={faArrowTrendUp} />
                    </span>
                </div>
            </div>
            <div className='flex-1'>
                <AverageBarChart cpu={cpu} ram={ram} disk={disk} />
            </div>
        </div>
    );
}

export default SystemPerformance;
