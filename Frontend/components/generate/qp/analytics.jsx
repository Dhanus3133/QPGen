import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function AnalyticsTest({ co, btl }) {
  const btlData = {
    labels: Object.keys(btl),
    datasets: [
      {
        label: "Blooms Taxonomy",
        data: Object.values(btl),
        fill: true,
      },
    ],
  };

  const datasets = [];

  for (const part in co) {
    if (Object.hasOwnProperty.call(co, part)) {
      const data = Object.values(co[part]);
      datasets.push({
        label: `Part ${part}`,
        data: data,
        fill: false,
      });
    }
  }

  const coData = {
    labels: Object.keys(co["A"]),
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <div className="max-w-lg text-center">
        <Line data={btlData} options={options} width={200} height={200} />
      </div>
      <div className="max-w-lg text-center">
        <Line data={coData} options={options} width={200} height={200} />
      </div>
    </div>
  );
}
