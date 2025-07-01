import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
    health: number;
    unhealth: number;
    total: number;
};

export const DoughnutChartv2 = ({ health, unhealth, total }: Props) => {
    const offline = Math.max(total - health - unhealth, 0); // Tính toán số thiết bị offline

    const data = {
        labels: ['Health Devices', 'Unhealth Devices', 'Offline Devices'],
        datasets: [
            {
                data: [health, unhealth, offline],
                backgroundColor: ['#85CC16', '#F7CA4C', '#D4DBE6'], // xanh lá, cam, xám
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        cutout: '70%',
        borderRadius: 5,
    };

    return (
        <div className="w-50 h-50 relative">
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-xl font-semibold text-gray-700 flex flex-col items-center">
                    <span>{Math.round((health / total) * 100)}%</span>
                    <p>Total Health</p>
                </div>
            </div>
        </div>
    );
};
