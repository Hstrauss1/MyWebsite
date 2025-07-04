"use client";
import useThemeToggle from "@/hooks/useThemeToggle";

export default function ThemeToggle() {
  const [isDark, toggleTheme] = useThemeToggle();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <svg
        className="theme-icon"
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", left: "12px", top: "12px" }}
      >
        <defs>
          <linearGradient id="triangleGradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#a2d55d" />
            <stop offset="100%" stopColor="#ff0000" />
          </linearGradient>
        </defs>
        {isDark ? (
          <path
            d="M19.6426 19H1.35742L10.5 1.09863L19.6426 19Z"
            fill="url(#triangleGradient)"
            stroke="url(#triangleGradient)"
          />
        ) : (
          <path d="M10.5 0L20.4593 19.5H0.540708L10.5 0Z" fill="currentColor" />
        )}
      </svg>
      <div
        className="theme-dot"
        style={{ position: "absolute", left: "20.8px", top: "10px" }}
      ></div>
      <div
        className="theme-line-top"
        style={{ position: "absolute", left: "22px", top: "3px" }}
      ></div>
      <div
        className="theme-line-bottom"
        style={{ position: "absolute", left: "22px", top: "31px" }}
      ></div>
    </button>
  );
}
