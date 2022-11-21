import { useEffect } from "react";
import Vditor from "vditor";

export default function RenderVditor({ id }) {
  useEffect(() => {
    const previewElement = document.getElementById(id);
    Vditor.setContentTheme(
      "light",
      "https://unpkg.com/vditor@3.8.17/dist/css/content-theme"
    );
    Vditor.codeRender(previewElement);
    Vditor.highlightRender(
      { enable: true, lineNumber: false, style: "github" },
      previewElement,
      "https://unpkg.com/vditor@3.8.17"
    );
    Vditor.mathRender(previewElement, {
      cdn: "https://unpkg.com/vditor@3.8.17",
      math: { engine: "KaTeX", inlineDigit: false, macros: {} },
    });
    Vditor.mermaidRender(
      previewElement,
      "https://unpkg.com/vditor@3.8.17",
      "classic"
    );
    Vditor.flowchartRender(previewElement, "https://unpkg.com/vditor@3.8.17");
    Vditor.graphvizRender(previewElement, "https://unpkg.com/vditor@3.8.17");
    Vditor.chartRender(
      previewElement,
      "https://unpkg.com/vditor@3.8.17",
      "classic"
    );
    Vditor.mindmapRender(
      previewElement,
      "https://unpkg.com/vditor@3.8.17",
      "classic"
    );
    Vditor.abcRender(previewElement, "https://unpkg.com/vditor@3.8.17");
    Vditor.mediaRender(previewElement);
    Vditor.speechRender(previewElement);
  });
  // Vditor.mediaRender("preview");
}
