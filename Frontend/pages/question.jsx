import RenderVditor from "components/renderVditor";
import { useState, useEffect } from "react";
import Vditor from "vditor";

// import {getMarkdown} from 'vditor/src/ts/markdown/getMarkdown.ts';

import CustomVditor from "../components/vditor";

// export const getMarkdown = (vditor: IVditor) => {
//     if (vditor.currentMode === "sv") {
//         return code160to32(`${vditor.sv.element.textContent}\n`.replace(/\n\n$/, "\n"));
//     } else if (vditor.currentMode === "wysiwyg") {
//         return vditor.lute.VditorDOM2Md(vditor.wysiwyg.element.innerHTML);
//     } else if (vditor.currentMode === "ir") {
//         return vditor.lute.VditorIRDOM2Md(vditor.ir.element.innerHTML);
//     }
//     return "";
// };
// console.log(getMarkdown);

// const exportPDF = (vditor) => {
//
//     vditor.tip.show(window.VditorI18n.generate, 3800);
//     const iframe = document.querySelector("iframe");
//     iframe.contentDocument.open();
//     iframe.contentDocument.write(`
// <div id="preview">Hello</div>
// `);
//     iframe.contentDocument.close();
//     setTimeout(() => {
//         console.log("hello");
//
//         // iframe.contentWindow.postMessage(getMarkdown(vditor), "*");
//     }, 200);
// };

const Home = () => {
  const [vQuestion, vSetQuestion] = useState(null);
  const [vAnswer, vSetAnswer] = useState(null);
  // const sanitizer = dompurify.sanitize;
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
          console.log(vQuestion.getValue());
          // exportPDF(vQuestion);
          // console.log(getMarkdown(vQuestion));
        }}
      >
        Submit
      </button>
      <div className="vditor-reset" id="preview">
        <p>
          <code>Vditor</code> is awesome!
          <span className="language-math">{`\\utilde{AB}`}</span>
        </p>
      </div>
      <div
        id="myown"
        dangerouslySetInnerHTML={{
          __html: vQuestion ? vQuestion.getHTML() : "Loading...",
        }}
      ></div>
      <RenderVditor id="preview" />
      <RenderVditor id="myown" />
    </div>
  );
};
export default Home;
// {vQuestion ? <RenderVditor id="myown" /> : ""}
// {vQuestion
//         ? console.log(vQuestion.getHTML().replace(/class=/g, "className="))
//         : `Loading`}
// {vQuestion ? <RenderVditor id="question" /> : `Loading`}
