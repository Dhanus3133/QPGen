import { useQuery } from "@apollo/client";
import { Autocomplete, TextField } from "@mui/material";
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
        <div className="m-10 w-full mx-auto">
          <Autocomplete
            id="semester"
            sx={{ maxWidth: 300 }}
            className="m-10 mx-auto"
            options={semesters}
            value={selectedSemester}
            getOptionLabel={(option) => {
              return String(option);
            }}
            autoHighlight
            onChange={handleSemesterChange}
            renderInput={(params) => (
              <TextField {...params} label="Semester" placeholder="Semester" />
            )}
          />
          <Autocomplete
            id="department"
            sx={{ maxWidth: 300 }}
            className="m-10 mx-auto"
            options={departments}
            value={selectedDepartment}
            autoHighlight
            onChange={handleDepartmentChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Department"
                placeholder="Department"
              />
            )}
          />
        </div>
        <div className="h-[500px]">
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
