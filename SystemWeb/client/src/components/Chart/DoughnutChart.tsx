import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
    percent: number;
};

export const DoughnutChart = ({ percent }: Props) => {
    const data = {
        labels: ['Usage (%)', 'Free (%)'],
        datasets: [
            {
                data: [percent, 100 - percent],
                backgroundColor: ['#85CC16', '#E5E7EB'],
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
                <div className="text-2xl font-semibold text-gray-600">{Math.floor(percent)}%</div>
            </div>
        </div>
    );
};
