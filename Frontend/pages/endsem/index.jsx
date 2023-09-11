// // import CustomVditor from "components/vditor";
// import Table from "components/Table";

// export default function index() {
//     return (
//     <>
//         <h1 className="text-xl text-center font-bold align-center">Add Questions</h1>
//         <Table data={[{column1: "1", column2: "What is linked list? Give any two applications of linked lists."}]} />
//     </>
//     );
// }
// pages/endsem/index.jsx

import Table from '../../components/Table';

function EndSem() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl text-center font-bold align-center">
        Add Questions
      </h1>
      <Table data={[]} />
    </div>
  );
};

export default EndSem;
