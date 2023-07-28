import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "chartjs-plugin-datalabels";
import ChartDataLabels from "chartjs-plugin-datalabels";

function getPercentageData(data, label) {
  let total = 0;
  let percents = [];
  let setsOfData = [
    {
      label: `${label} (%)`,
      fill: true,
    },
  ];
  for (const [key, value] of Object.entries(data)) {
    total += value;
  }
  for (const [key, value] of Object.entries(data)) {
    percents.push(((value / total) * 100).toFixed(0));
  }
  for (let i of setsOfData) {
    if (i.label == `${label} (%)`) {
      i["data"] = percents;
    }
  }
  const obj = {
    labels: Object.keys(data),
    datasets: setsOfData,
  };
  return obj;
}

export default function AnalyticsTest({ co, btl }) {
  const btlData = getPercentageData(btl, "Blooms Taxonomy");
  const coData = getPercentageData(co, "CO");

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: (value) => `${value}%`,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    barThickness: 20,
  };

  return (
    <div className="flex justify-center mt-2">
      <div className="grid grid-cols-2 gap-4 max-w-3xl">
        <div className="text-center">
          <div>
            <Bar
              data={btlData}
              options={options}
              width={280}
              height={200}
              plugins={[ChartDataLabels]}
            />
          </div>
          <p className="text-xs">Blooms Taxonomy (%)</p>
        </div>
        <div className="text-center">
          <div>
            <Bar
              data={coData}
              options={options}
              width={280}
              height={200}
              plugins={[ChartDataLabels]}
            />
          </div>
          <p className="text-xs">CO (%)</p>
        </div>
      </div>
    </div>
  );
}
