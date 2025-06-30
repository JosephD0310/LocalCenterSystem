import { faCircleCheck, faCircleExclamation, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AverageBarChart from './AverageBarChart';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type SystemPerformanceProps = {
    cpu: number;
    ram: number;
    disk: number;
};

function SystemPerformance({ cpu, ram, disk }: SystemPerformanceProps) {
    function getUsageColor(value: number): string {
        if (value <= 50) return 'text-green-500';
        if (value <= 80) return 'text-yellow-500';
        return 'text-red-500';
    }
    function getUsageIcon(value: number): IconProp {
        if (value <= 50) return faCircleCheck;
        if (value <= 80) return faExclamationTriangle;
        return faCircleExclamation;
    }
    return (
        <div className="flex flex-row items-center gap-10">
            <div className="flex-1 flex flex-col gap-5 font-bold bg-[#E7F5D3] rounded-2xl px-7 py-5 border-l-4 border-[#85CC16] transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                    <span>Average CPU</span>
                    <span className={getUsageColor(cpu)}>
                        {cpu}% <FontAwesomeIcon icon={getUsageIcon(cpu)} />
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Average RAM</span>
                    <span className={getUsageColor(ram)}>
                        {ram}% <FontAwesomeIcon icon={getUsageIcon(ram)} />
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Average Disk</span>
                    <span className={getUsageColor(disk)}>
                        {disk}% <FontAwesomeIcon icon={getUsageIcon(disk)} />
                    </span>
                </div>
            </div>
            <div className="flex-1">
                <AverageBarChart cpu={cpu} ram={ram} disk={disk} />
            </div>
        </div>
    );
}

export default SystemPerformance;
