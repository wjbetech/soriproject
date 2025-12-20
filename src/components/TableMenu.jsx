import React from "react";

export default function TableMenu() {
  return (
    <div role="tablist" className="tabs tabs-box w-full">
      <a role="tab" className="tab w-1/3">
        General
      </a>
      <a role="tab" className="tab w-1/3">
        Animals
      </a>
      <a role="tab" className="tab w-1/3">
        Manhwa
      </a>
    </div>
  );
}
