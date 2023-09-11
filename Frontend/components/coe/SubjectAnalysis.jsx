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

const SubjectAnalysis = ({
  type,
  dataBySem,
  selectedSemester,
  dataByDept,
  selectedDepartment,
  dataBySemAndDept,
}) => {
  let data;
  if (type == 3) {
    data = dataBySem[selectedSemester];
    return (
      <div>
        {data.map((item) => {
          const updatedGraphData = item.analysisBtl.map((it) => ({
            name: it.btl.name,
            value: it.percentage,
          }));
          return (
            <div className="m-5" style={{ width: "500px", height: "500px" }}>
              <h1>{item.subject.subjectName}</h1>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
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
        })}
      </div>
    );
  } else if (type == 2) {
    data = dataByDept[selectedDepartment];
    return (
      <div>
        {data.map((item) => {
          const updatedGraphData = item.analysisBtl.map((it) => ({
            name: it.btl.name,
            value: it.percentage,
          }));
          return (
            <div className="m-5" style={{ width: "500px", height: "500px" }}>
              <h1>{item.subject.subjectName}</h1>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
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
        })}
      </div>
    );
  } else if (type == 1) {
    data = dataBySemAndDept[selectedDepartment][selectedSemester];
    return (
      <div>
        {data.map((item) => {
          const updatedGraphData = item.analysisBtl.map((it) => ({ name: it.btl.name,
            value: it.percentage,
          }));
          return (
            <div className="m-5" style={{ width: "500px", height: "500px" }}>
              <h1>{item.subject.subjectName}</h1>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
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
        })}
      </div>
    );
  } else {
    return <div>No filter selected</div>;
  }
};

export default SubjectAnalysis;
