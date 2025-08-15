// TrexDinoWidgets.tsx
import React from "react";

export function TrexRenderer({
  scale,
  biting,
  yaw,
}: {
  scale: number;
  biting: boolean;
  yaw: number;
}) {
  return (
    <div
      className="entity trex"
      style={{
        transform: `translate(-50%, -100%) scale(${scale}) rotate(${
          yaw * 4
        }deg)`,
      }}
    >
      <svg
        className="trex-svg"
        width="220"
        height="120"
        viewBox="0 0 220 120"
        aria-label="T-Rex"
      >
        {/* Neck */}
        <path
          className="trex-neck-shape"
          d="M10,90 C60,40 110,40 150,52 L150,88 C105,96 60,100 10,90 Z"
        />
        {/* Skull */}
        <path
          className="trex-skull"
          d="M100,35 C140,5 195,15 210,32 C216,40 210,55 195,62 C170,72 130,65 110,58 C102,55 96,48 100,35 Z"
        />
        {/* Upper teeth */}
        {Array.from({ length: 8 }).map((_, i) => {
          const t = i / 7;
          const x = 118 + t * 75;
          const y = 55 - t * 6;
          return <path key={i} className="tooth" d={`M${x},${y} l-6,10`} />;
        })}
        {/* Eye */}
        <circle className="trex-eye" cx="140" cy="28" r="5" />
        <rect
          className="trex-eye-blink"
          x="135"
          y="22"
          width="10"
          height="10"
          rx="5"
        />
        {/* Lower jaw (animated) */}
        <g className={`trex-jaw ${biting ? "is-biting" : ""}`}>
          <path
            className="trex-jaw-shape"
            d="M112,60 C140,75 178,82 198,88 C205,90 206,98 200,100 C180,98 145,90 110,76 Z"
          />
          {Array.from({ length: 7 }).map((_, i) => {
            const t = i / 6;
            const x = 120 + t * 70;
            const y = 82 + t * 2;
            return <path key={i} className="tooth" d={`M${x},${y} l-6,10`} />;
          })}
        </g>
      </svg>
    </div>
  );
}

export function DinoRenderer({ scale }: { scale: number }) {
  return (
    <div
      className="entity dino"
      style={{ transform: `translate(-50%, -100%) scale(${scale})` }}
      aria-label="Small dinosaur"
    >
      <svg className="dino-svg" width="120" height="90" viewBox="0 0 120 90">
        {/* Tail */}
        <path className="dino-tail" d="M8,52 Q2,40 20,46 Q14,54 8,52 Z" />
        {/* Body */}
        <ellipse className="dino-body" cx="50" cy="50" rx="30" ry="18" />
        {/* Head */}
        <ellipse className="dino-head" cx="78" cy="42" rx="14" ry="10" />
        <circle className="dino-eye" cx="83" cy="40" r="2.2" />
        {/* Legs */}
        <g className="dino-legs">
          <path className="leg leg-front" d="M44,66 l8,14 l-6,0 l-7,-10 Z" />
          <path className="leg leg-back" d="M56,66 l8,14 l-6,0 l-7,-10 Z" />
        </g>
      </svg>
    </div>
  );
}
