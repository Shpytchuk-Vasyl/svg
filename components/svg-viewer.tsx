"use client";

import { useEffect, useRef, useState } from "react";
import "@/styles/globals.css";

type SvgViewerProps = {
  url: string;
  className?: string;
  reload?: string | number;
};

export function SvgViewer({ url, className, reload }: SvgViewerProps) {
  const [svgContent, setSvgContent] = useState<string>("");
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch(url);
        const svgText = await response.text();
        // Create a temporary div to parse the SVG
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = svgText;
        const svgElement = tempDiv.querySelector("svg");

        if (svgElement) {
          if (!svgElement.getAttribute("viewBox")) {
            const width = svgElement.getAttribute("width");
            const height = svgElement.getAttribute("height");
            if (width && height) {
              svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`);
            }
          }

          // Set preserveAspectRatio to maintain aspect ratio
          svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

          // Remove fixed width and height to allow scaling
          svgElement.removeAttribute("width");
          svgElement.removeAttribute("height");

          // Add class for proper scaling
          svgElement.classList.add("w-full", "h-full");
        }

        setSvgContent(tempDiv.innerHTML);
      } catch (error) {
        console.error("Error fetching SVG:", error);
      }
    };

    fetchSvg();
  }, [url]);

  useEffect(() => {
    const paths = divRef.current?.querySelectorAll("path");
    paths?.forEach(function (path) {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length.toString();
      path.style.strokeDashoffset = length.toString();
      path.style.animation = "drawStroke 6s ease-in-out";
    });
  }, [svgContent, reload]);

  if (!svgContent) {
    return <div className="animate-pulse bg-muted w-full h-full" />;
  }

  return (
    <div
      ref={divRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
