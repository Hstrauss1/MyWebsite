"use client";
import { useState, useEffect } from "react";

const useThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  const setTheme = (dark: boolean) => {
    const theme = dark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const isDark = savedTheme === "dark";
      setIsDark(isDark);
      setTheme(isDark);
      return;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    setIsDark(prefersDark);
    setTheme(prefersDark);
  }, []);

  const toggleTheme = () => {
    const dark = !isDark;
    setIsDark(dark);
    setTheme(dark);
  };

  return [isDark, toggleTheme] as const;
};

export default useThemeToggle;
