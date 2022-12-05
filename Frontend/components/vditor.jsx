import { useState, useEffect } from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";
import Preview from "vditor";
import RenderVditor from "./renderVditor";
import InitializeVditor from "./InitializeVditor";

export default function CustomVditor({ id, value, vd, setVd, className }) {
  return (
    <>
      <InitializeVditor id={id} value={value} vd={vd} setVd={setVd} />
      <div id={id} className={`vditor + ${className}`} />
    </>
  );
  // if (vd) {
  //   return (
  //     <>
  //       <div
  //         id={id}
  //         dangerouslySetInnerHTML={{
  //           __html: vd.getHTML(),
  //         }}
  //       ></div>
  //       <RenderVditor id={id} />;
  //     </>
  //   );
  // }
}
