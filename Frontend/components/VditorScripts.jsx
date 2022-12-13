import { useEffect } from "react";
import Vditor from "vditor";


  useEffect(() => {
    if (!vd) {
      const vditor = new Vditor(id, {
        after: () => {
          setVd(vditor);
        },
      });
    }
  }, []);
  useEffect(() => {
    if (vd) {
      vd.setValue(value);
      console.log("hello");
    }
  }, [vd]);

  return <div id={id} className="vditor" />;

