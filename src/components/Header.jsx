import React from "react";

export default function Header() {
  return (
    <div className="px-6 py-12 m-auto flex justify-center items-center w-full flex-col">
      <p>
        <span className="font-bold">MongMong</span> is a tool for quickly finding any of the vast number of sound words
        used by the Korean language.
      </p>
      <p className="text-base-content/60">
        If you like this project, please consider supporting me{" "}
        <a href="#" className="cursor-not-allowed">
          here.
        </a>
      </p>
    </div>
  );
}
