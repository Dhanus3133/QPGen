import Vditor from "vditor";
import { useEffect } from "react";

const Question = ({ data, vd, setVd }) => {
  // console.log(data);
  useEffect(() => {
    if (!vd) {
      const dummy = document.createElement("div");
      dummy.id = "dummy";
      dummy.style.display = "none";
      document.body.appendChild(dummy);
      const vditor = new Vditor("dummy", {
        after: () => {
          setVd(vditor);
        },
      });
    }
  }, []);

  vd ? vd.setValue(data) : "";

  return (
    <>
      <td className="pl-2">
        <div
          id="generated-question"
          className="break-inside-avoid"
          dangerouslySetInnerHTML={{
            __html: vd ? vd.getHTML() : "Loading...",
          }}
        ></div>
      </td>
    </>
  );
};

export default Question;
