// components/Sparkline.tsx
import React from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  fillColor?: string;
  showDots?: boolean;
  className?: string;
}

export default function Sparkline({
  data,
  width = 200,
  height = 50,
  color = "#3b82f6",
  strokeWidth = 2,
  fillColor,
  showDots = false,
  className = "",
}: SparklineProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-xs">No data</span>
      </div>
    );
  }

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1; // Avoid division by zero

  // Create SVG path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - minValue) / range) * height;
    return { x, y, value };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  // Create fill area path if fillColor is provided
  const fillPath = fillColor
    ? `${pathData} L ${width} ${height} L 0 ${height} Z`
    : "";

  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Fill area */}
        {fillColor && <path d={fillPath} fill={fillColor} opacity={0.3} />}

        {/* Main line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {showDots &&
          points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={strokeWidth}
              fill={color}
              className="hover:r-3 transition-all duration-200"
            >
              <title>{`${point.value.toFixed(1)}%`}</title>
            </circle>
          ))}
      </svg>

      {/* Value labels */}
      <div className="absolute -top-5 left-0 text-xs text-gray-400">
        {minValue.toFixed(0)}%
      </div>
      <div className="absolute -top-5 right-0 text-xs text-gray-400">
        {maxValue.toFixed(0)}%
      </div>
    </div>
  );
}
