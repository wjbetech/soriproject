import React from "react";
import useAppStore from "../store/useAppStore";

export default function TableCategoryTag({ name }) {
  const category = useAppStore((state) => state.category);
  const setCategory = useAppStore((state) => state.setCategory);

  return (
    <button
      type="button"
      role="tab"
      className={`tab w-1/3 ${category === name ? "tab-active" : ""}`}
      onClick={() => setCategory(name)}>
      {name}
    </button>
  );
}
