import React from "react";
import TableCategoryTag from "./TableCategoryTag";

export default function TableMenu() {
  return (
    <div role="tablist" className="tabs tabs-box w-full">
      <TableCategoryTag name="General" label="General (일반 의태어)" />
      <TableCategoryTag name="Animals" label="Animals (의성어)" />
      <TableCategoryTag name="Manhwa" label="Manhwa (만화계)" />
    </div>
  );
}
