import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
const AnalysisGraph = ({updatedGraphData, item}) => {
  return (
    <div className="m-5 h-[500px] w-[500px]">
      <h1 className="text-xl">Semester {item?.courses[0]?.semester}</h1>
      <h2 className="text-md">{item?.subject?.subjectName}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={400}
          height={400}
          data={updatedGraphData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalysisGraph;
