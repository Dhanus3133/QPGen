import { useQuery } from "@apollo/client";
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
import { analysisQuery } from "@/src/graphql/queries/analysis";
import { useState } from "react";
import SubjectAnalysis from "components/coe/SubjectAnalysis";

const CoeAnalysis = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [updatedGraphData, setUpdatedGraphData] = useState([]);

  const departments = [];
  const semesters = [];

  const { data, loading, error } = useQuery(analysisQuery, {
    ssr: false,
    variables: {
      exam: "2",
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  let graphData = [];
  const dataBySem = {};
  const dataByDept = {};
  const dataBySemAndDept = {};

  if (data && data.analysis) {
    data.analysis.forEach((item) => {
      if (item.courses) {
        item.courses.map((course) => {
          const sem = course.semester;
          const dept = course.department.branchCode;
          if (!dataBySem[sem]) {
            dataBySem[sem] = [];
            semesters.push(sem);
          }
          dataBySem[sem].push(item);
          if (!dataByDept[dept]) {
            dataByDept[dept] = [];
            departments.push(dept);
          }
          dataByDept[dept].push(item);
          if (!dataBySemAndDept[dept]) {
            dataBySemAndDept[dept] = {};
          }

          if (!dataBySemAndDept[dept][sem]) {
            dataBySemAndDept[dept][sem] = [];
          }
          dataBySemAndDept[dept][sem].push(item);
        });
      }
    });
  }
  for (const key in dataByDept) {
    if (dataByDept.hasOwnProperty(key)) {
      dataByDept[key].sort(
        (a, b) => a.courses[0].semester - b.courses[0].semester,
      );
    }
  }

  for (const outerKey in dataBySemAndDept) {
    if (dataBySemAndDept.hasOwnProperty(outerKey)) {
      for (const innerKey in dataBySemAndDept[outerKey]) {
        if (dataBySemAndDept[outerKey].hasOwnProperty(innerKey)) {
          const value = dataBySemAndDept[outerKey][innerKey];
          const uniqueIds = new Set();
          dataBySemAndDept[outerKey][innerKey] = value.filter((i) => {
            console.log(i);
            if (!uniqueIds.has(i.id)) {
              uniqueIds.add(i.id);
              return true;
            }
            return false;
          });
        }
      }
    }
  }
  const handleDepartmentChange = (e) => {
    graphData = [];
    const selectedValue = e.target.value;
    setSelectedDepartment(e.target.value);
    if (selectedSemester !== "") {
      handleDepartmentAndSemesterChange(selectedValue, selectedSemester);
    } else {
      const length = dataByDept[selectedValue]?.length;
      dataByDept[selectedValue]?.map((dep) => {
        dep?.analysisBtl?.map((item) => {
          if (!graphData?.find((i) => i.name == item.btl.name)) {
            graphData.push({
              name: item.btl.name,
              value: item.percentage,
            });
          } else {
            const index = graphData.findIndex((i) => i.name == item.btl.name);
            graphData[index].value += item.percentage;
          }
        });
      });
      graphData = graphData.map((it) => {
        return { ...it, value: it.value / length };
      });
      setUpdatedGraphData(graphData);
    }
  };

  const handleSemesterChange = async (e) => {
    graphData = [];
    setSelectedSemester(e.target.value);
    const selectedValue = e.target.value;
    if (selectedDepartment != "") {
      handleDepartmentAndSemesterChange(selectedDepartment, selectedValue);
    } else {
      const length = dataBySem[selectedValue]?.length;
      dataBySem[selectedValue]?.map((sem) => {
        sem?.analysisBtl?.map((item) => {
          if (!graphData?.find((i) => i.name == item.btl.name)) {
            graphData.push({
              name: item.btl.name,
              value: item.percentage,
            });
          } else {
            const index = graphData.findIndex((i) => i.name == item.btl.name);
            graphData[index].value += item.percentage;
          }
        });
      });
      graphData = graphData.map((it) => {
        return { ...it, value: it.value / length };
      });
      setUpdatedGraphData(graphData);
    }
  };

  const handleDepartmentAndSemesterChange = (dept, sem) => {
    graphData = [];
    if (dept != "" && sem != "") {
      const compData = dataBySemAndDept[dept][sem];
      const length = compData?.length;
      if (!dept || !sem) {
      }
      compData.map((dat) => {
        dat?.analysisBtl.map((it) => {
          if (!graphData.find((i) => i.name == it.btl.name)) {
            graphData.push({
              name: it.btl.name,
              value: it.percentage,
            });
          } else {
            const index = graphData.findIndex((i) => i.name == it.btl.name);
            graphData[index].value += it.percentage;
          }
        });
      });
      graphData = graphData.map((it) => {
        return { ...it, value: it.value / length };
      });
      setUpdatedGraphData(graphData);
    }
  };

  return (
    <div className="h-screen w-screen">
      <div className="m-10">
        <div className="m-10 w-full h-40">
          <div className="w-full m-5">
            <select
              onChange={handleDepartmentChange}
              className="w-96 h-10 px-4 mx-auto py-2 bg-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
              value={selectedDepartment}
            >
              <option value="">Select the department</option>
              {departments?.map((d, index) => (
                <option key={index}>{d}</option>
              ))}
            </select>
          </div>
          <div className="w-full m-5">
            <select
              className="w-96 h-10 px-4 mx-auto py-2 bg-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
              onChange={handleSemesterChange}
              value={selectedSemester}
            >
              <option value="">Select the semester</option>
              {semesters?.map((d, index) => (
                <option value={d} key={index}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="h-[500px] select-none">
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
          </ResponsiveContainer>{" "}
        </div>
      </div>
      <div>
        <SubjectAnalysis
          type={
            selectedDepartment != "" && selectedSemester != ""
              ? 1
              : selectedDepartment != ""
              ? 2
              : selectedSemester != ""
              ? 3
              : null
          }
          dataBySem={dataBySem}
          dataByDept={dataByDept}
          dataBySemAndDept={dataBySemAndDept}
          selectedSemester={selectedSemester}
          selectedDepartment={selectedDepartment}
        />
      </div>
    </div>
  );
};

export default CoeAnalysis;
