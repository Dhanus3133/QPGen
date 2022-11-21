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
      });
    }
  }, []);
  useEffect(() => {
    if (vd) {
      vd.setValue(value);
    }
  }, [vd]);
}
