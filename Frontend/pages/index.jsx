import { useState, useEffect } from "react";

import CustomVditor from "../components/vditor";

const Home = () => {
  const [vQuestion, vSetQuestion] = useState(null);
  const [vAnswer, vSetAnswer] = useState(null);
  return (
    <div>
      <CustomVditor
        id="question"
        value="`Vditor` is awesome!$\utilde{AB}$ $\begin{vmatrix} a & b \\ c & d\end{vmatrix}$"
        vd={vQuestion}
        setVd={vSetQuestion}
      />
      <CustomVditor
        id="answer"
        value="`Vditor` is awesome!$\utilde{AB}$ $\begin{vmatrix} a & b \\ c & d\end{vmatrix}$"
        vd={vAnswer}
        setVd={vSetAnswer}
      />
      <button
        onClick={() => {
          console.log(vQuestion.getHTML());
          // console.log(vAnswer.getValue());
        }}
      >
        Submit
      </button>
    </div>
  );
};
export default Home;
