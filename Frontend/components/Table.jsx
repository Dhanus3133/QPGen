// function Table ({ data }) {
//   return (
//     <table className="min-w-full">
//       <thead>
//         <tr>
//           <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
//             QNo.
//           </th>
//           <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
//             Questions
//           </th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((item, index) => (
//           <tr
//             key={index}
//             className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
//           >
//             <td className="px-6 py-4 whitespace-no-wrap text-black">
//               {item.column1}
//             </td>
//             <td className="px-6 py-4 whitespace-no-wrap text-black">
//               {item.column2}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default Table;
// components/Table.jsx
import React, { useState } from 'react';

function Table({ data }){
  const [showModal, setShowModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewQuestion('');
  };

  return (
    <div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              QNo.
            </th>
            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Questions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="px-6 py-4 whitespace-no-wrap text-black">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap text-black">
                {item.column2}
              </td>
            </tr>
          ))}
          {Array(10 - data.length)
            .fill(null)
            .map((_, index) => (
              <tr
                key={index + data.length}
                className={
                  (index + data.length) % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }
              >
                <td className="px-6 py-4 whitespace-no-wrap text-black">
                  {data.length + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap text-black">
                  <button
                    onClick={openModal}
                    className="text-white px-5 bg-blue-500 rounded-xl font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 max-w-md mx-auto rounded-lg shadow-lg">
            <textarea
              className="vditor-reset"
              rows="10"
              placeholder="Enter your question here..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
                onClick={() => closeModal()}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md"
                onClick={() => {
                  // Add your logic to save the new question here
                  closeModal();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
