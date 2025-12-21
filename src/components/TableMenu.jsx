import React from "react";
import TableCategoryTag from "./TableCategoryTag";

export default function TableMenu() {
  return (
    <div role="tablist" className="tabs tabs-box w-full">
      <TableCategoryTag name="General (일반 의태어)" />
      <TableCategoryTag name="Animals (의성어)" />
      <TableCategoryTag name="Manhwa (만화계)" />
    </div>
  );
}
