import React from "react";
import TableCategoryTag from "./TableCategoryTag";

export default function TableMenu() {
  return (
    <div role="tablist" className="tabs tabs-box w-full">
      <TableCategoryTag name="General" />
      <TableCategoryTag name="Animals" />
      <TableCategoryTag name="Manhwa" />
    </div>
  );
}
