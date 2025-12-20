import React, { useMemo } from "react";
import general from "../data/general.json";
import animals from "../data/animals.json";
import manhwa from "../data/manhwa.json";
import useAppStore from "../store/useAppStore";

export default function Table() {
  const category = useAppStore((s) => s.category);

  const items = useMemo(() => {
    if (!category || category === "All") {
      return [
        ...general.map((i) => ({ ...i, category: "General" })),
        ...animals.map((i) => ({ ...i, category: "Animals" })),
        ...manhwa.map((i) => ({ ...i, category: "Manhwa" }))
      ];
    }

    if (category === "General") return general.map((i) => ({ ...i, category: "General" }));
    if (category === "Animals") return animals.map((i) => ({ ...i, category: "Animals" }));
    if (category === "Manhwa") return manhwa.map((i) => ({ ...i, category: "Manhwa" }));

    return [];
  }, [category]);

  const columnCount = category === "Animals" ? 3 : 2;
  const colWidth = `${100 / columnCount}%`;

  return (
    <div className="overflow-x-auto mt-4 border border-base-300 rounded-md">
      <table className="table table-fixed w-full border-collapse text-base">
        <thead className="bg-base-200">
          <tr>
            <th style={{ width: colWidth }} className="text-left px-4 py-3">
              Term
            </th>
            {/* Category column removed per design */}
            {category === "Animals" && (
              <th style={{ width: colWidth }} className="text-left px-4 py-3">
                Animal
              </th>
            )}
            <th style={{ width: colWidth }} className="text-left px-4 py-3">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx) => (
            <tr key={`${it.term}-${idx}`} className="border-b last:border-b-0">
              <td style={{ width: colWidth }} className="px-4 py-3 align-middle wrap-break-word">
                {it.term}
              </td>
              {/* Category cell removed */}
              {category === "Animals" && (
                <td style={{ width: colWidth }} className="px-4 py-3 align-middle wrap-break-word">
                  {it.animal || "—"}
                </td>
              )}
              <td style={{ width: colWidth }} className="px-4 py-3 align-middle text-base-content wrap-break-word">
                {it.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
