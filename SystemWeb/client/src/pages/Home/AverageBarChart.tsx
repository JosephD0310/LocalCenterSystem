import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  cpu: number;
  ram: number;
  disk: number;
};

export default function AverageBarChart({ cpu, ram, disk }: Props) {
  const data = {
    labels: ['CPU (%)', 'RAM (%)', 'Disk (%)'],
    datasets: [
      {
        label: 'Average Usage',
        data: [cpu, ram, disk],
        backgroundColor: ['#85CC16', '#FFCA22', '#FF6928'],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.parsed.y}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (tickValue: string | number) {
            return `${tickValue}%`;
          },
        },
      },
    },
  };

  return (
    <div className="max-h-[150px] flex items-center justify-center">
      <Bar data={data} options={options} />
    </div>
  );
}
