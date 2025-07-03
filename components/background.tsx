"use client";

import { useEffect, useState } from "react";

const TILE = 300;

export default function Background() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  // Track window size to apply correct SVG viewBox
  useEffect(() => {
    const updateSize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Track theme toggle
  useEffect(() => {
    const syncTheme = () =>
      setTheme(
        (document.documentElement.getAttribute("data-theme") as
          | "light"
          | "dark") ?? "light"
      );

    syncTheme();
    const mo = new MutationObserver(syncTheme);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => mo.disconnect();
  }, []);

  const img =
    theme === "dark" ? "/images/dark-pattern.svg" : "/images/pattern.svg";

  return (
    <svg
      className="fixed inset-0 -z-50 pointer-events-none block"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="hex0"
          patternUnits="userSpaceOnUse"
          width={TILE}
          height={TILE}
        >
          <image href={img} width={TILE} height={TILE} />
        </pattern>
        <pattern
          id="hexShift"
          patternUnits="userSpaceOnUse"
          width={TILE}
          height={TILE}
          patternTransform={`translate(${TILE / 2} ${TILE / 2})`}
        >
          <image href={img} width={TILE} height={TILE} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex0)" fillOpacity="0.2" />
      <rect
        width="100%"
        height="100%"
        fill="url(#hexShift)"
        fillOpacity="0.2"
      />
    </svg>
  );
}
