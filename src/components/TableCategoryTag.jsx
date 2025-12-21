import React from "react";
import useAppStore from "../store/useAppStore";

export default function TableCategoryTag({ name, label }) {
  const category = useAppStore((state) => state.category);
  const setCategory = useAppStore((state) => state.setCategory);

  return (
    <button
      type="button"
      role="tab"
      className={`tab w-1/3 h-12 flex items-center justify-center text-center leading-none ${
        category === name ? "tab-active" : ""
      }`}
      onClick={() => setCategory(name)}>
      {label ?? name}
    </button>
  );
}
