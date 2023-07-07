import "vditor/dist/index.css";
import InitializeVditor from "./InitializeVditor";

export default function CustomVditor({ id, value, vd, setVd, className }) {
  return (
    <>
      <InitializeVditor id={id} value={value} vd={vd} setVd={setVd} />
      <div id={id} className={`vditor + ${className}`} />
    </>
  );
}
