"use client";
import { useEffect } from "react";

export default function ThemeInitializer() {
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark =
      stored === "dark" ||
      (stored !== "light" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  return null;
}
