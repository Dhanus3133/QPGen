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
      <div>
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
      <div>
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
      <div>
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
    return <div>No filter selected</div>;
  }
};

export default SubjectAnalysis;
