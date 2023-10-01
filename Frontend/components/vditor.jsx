import "vditor/dist/index.css";
import InitializeVditor from "./InitializeVditor";

export default function CustomVditor({
  id,
  value,
  vd,
  setVd,
  className = "",
  location = "question",
}) {
  return (
    <>
      <InitializeVditor
        id={id}
        value={value}
        vd={vd}
        setVd={setVd}
        location={location}
      />
      <div id={id} className={`vditor ${className}`} />
    </>
  );
}
