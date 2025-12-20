import React from "react";

const currentTheme = document.documentElement.getAttribute("data-theme") || "light";

export default function Navbar() {
  return (
    <div className="p-6 flex justify-between w-full border-b border-base-300">
      <h2 className="font-semibold text-2xl">HanSori</h2>
      <div className="flex flex-row gap-4 items-center">
        <div className="flex flex-row gap-2">
          <label className="text-sm">{currentTheme === "light" ? "Dark" : "Light"}</label>
          <input type="checkbox" value="synthwave" className="toggle theme-controller" />
        </div>
        <input type="text" placeholder="Search..." className="input" />
      </div>
    </div>
  );
}
