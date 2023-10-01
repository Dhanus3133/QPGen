import { useEffect } from "react";
import Vditor from "vditor";

export default function RenderVditor({ id }) {
  useEffect(() => {
    const previewElement = document.getElementById(id);
    Vditor.setContentTheme("light");
    // Vditor.codeRender(previewElement);
    Vditor.highlightRender(
      { enable: true, lineNumber: false, style: "github" },
      previewElement,
    );
    Vditor.mathRender(previewElement, {
      math: { engine: "KaTeX", inlineDigit: false, macros: {} },
    });
    Vditor.mermaidRender(previewElement);
    Vditor.flowchartRender(previewElement);
    Vditor.graphvizRender(previewElement);
    Vditor.chartRender(
      previewElement,
      // "https://unpkg.com/vditor@3.8.17",
      "classic",
    );
    Vditor.mindmapRender(
      previewElement,
      // "https://unpkg.com/vditor@3.8.17",
      "classic",
    );
    Vditor.abcRender(previewElement);
    Vditor.mediaRender(previewElement);
    // Vditor.speechRender(previewElement);
  });
  // Vditor.mediaRender("preview");
}
