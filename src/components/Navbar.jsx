import React, { useEffect } from "react";
import useAppStore from "../store/useAppStore";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  // Apply theme to document root when it changes
  useEffect(() => {
    if (typeof document !== "undefined" && document.documentElement) {
      // Map app-level theme to a daisyUI theme name
      const mapped = theme === "dark" ? "synthwave" : "fantasy";
      document.documentElement.setAttribute("data-theme", mapped);
    }
  }, [theme]);

  return (
    <div className="p-6 flex justify-between w-full border-b border-base-300">
      <h2 className="font-semibold text-2xl">HanSori</h2>
      <div className="flex flex-row gap-4 items-center">
        <div className="flex flex-row gap-2 items-center">
          <label className="text-sm">{theme === "light" ? "Light" : "Dark"}</label>
          <input
            aria-label="Toggle theme"
            type="checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
            className="toggle theme-controller"
          />
        </div>
        <SearchBar />
      </div>
    </div>
  );
}
