import { useEffect } from "react";
import Vditor from "vditor";

export default function InitializeVditor({ id, value, vd, setVd }) {
  useEffect(() => {
    if (!vd) {
      const vditor = new Vditor(id, {
        after: () => {
          setVd(vditor);
        },
        lang: "en_US",
        width: "100%",
        upload: {
          url: "/upload/",
          multiple: false,
        },
      });
    }
  }, []);
  useEffect(() => {
    if (vd) {
      vd.setValue(value);
    }
  }, [vd]);
}
