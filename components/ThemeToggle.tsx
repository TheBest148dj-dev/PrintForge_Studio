"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("printforge-theme");
    const nextTheme = savedTheme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
  }, []);

  function changeTheme(nextTheme: ThemeMode) {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("printforge-theme", nextTheme);
  }

  return (
    <div className="theme-toggle">
      <button
        type="button"
        className={theme === "light" ? "theme-segment active" : "theme-segment"}
        onClick={() => changeTheme("light")}
      >
        Light
      </button>
      <button
        type="button"
        className={theme === "dark" ? "theme-segment active" : "theme-segment"}
        onClick={() => changeTheme("dark")}
      >
        Dark
      </button>
    </div>
  );
}
