import AnalysisGraph from "./AnalysisGraph";

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
      <div className="grid grid-cols-3 gap-7 h-full w-full ml-5">
        {data.map((item) => {
          const updatedGraphData = item.analysisBtl.map((it) => ({
            name: it.btl.name,
            value: it.percentage,
          }));
          return <AnalysisGraph item={item} updatedGraphData={updatedGraphData} />;
        })}
      </div>
    );
  } else if (type == 2) {
    data = dataByDept[selectedDepartment];
    return (
      <div className="grid grid-cols-3 gap-7 h-full w-full ml-5">
        {data.map((item) => {
          const updatedGraphData = item.analysisBtl.map((it) => ({
            name: it.btl.name,
            value: it.percentage,
          }));
          return <AnalysisGraph item={item} updatedGraphData={updatedGraphData} />;
        })}
      </div>
    );
  } else if (type == 1) {
    data = dataBySemAndDept[selectedDepartment][selectedSemester];
    return (
      <div className="grid grid-cols-3 gap-7 h-full w-full ml-5">
        {data.map((item) => {
          const updatedGraphData = item.analysisBtl.map((it) => ({
            name: it.btl.name,
            value: it.percentage,
          }));
          return <AnalysisGraph item={item} updatedGraphData={updatedGraphData} />;
        })}
      </div>
    );
  } else {
    return <div className="text-3xl text-center w-full">No filter selected</div>;
  }
};

export default SubjectAnalysis;
