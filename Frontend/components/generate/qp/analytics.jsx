import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
// import 'chartjs-plugin-labels';
export default function AnalyticsTest({ co, btl }) {
  let total = 0;
  let percents = []
  let setsOfData = [
    {
        label: "Blooms Taxonomy",
        // data: Object.values(btl),
        fill: true,
      },
  ]
  for (const [key, value] of Object.entries(btl)){
    console.log(value);
    total+=value;
  }
  for (const [key, value] of Object.entries(btl)){
    console.log(value);
    percents.push((value/total*100).toFixed(0))
  }
  console.log(percents)
  for(let i of setsOfData ){
    if(i.label == "Blooms Taxonomy"){
      i["data"] = percents;
    }
  }

  const btlData = {
    labels: Object.keys(btl),
    datasets:setsOfData,
    
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
    // style:'percent',
    plugins: {
        labels: {
          render: 'percentage',
        }
      },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <div className="max-w-lg text-center">
        <Bar data={btlData} options={options} width={200} height={200} />
      </div>
      <div className="max-w-lg text-center">
        <Bar data={coData} options={options} width={200} height={200} />
      </div>
    </div>
  );
}
