import React, { useState, useRef, useEffect } from "react";
import useSearch from "../hooks/useSearch";

export default function SearchBar() {
  const { searchTerm, setSearch, submit, suggestions, selectSuggestion, showSkeleton } = useSearch();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const [skeletonVisible, setSkeletonVisible] = useState(true);

  useEffect(() => {
    // close dropdown when clicking outside
    function onDoc(e) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  // Manage skeleton visibility: show skeleton initially when input is focused/empty, then hide after 2s
  useEffect(() => {
    let start;
    let t;
    if (open && showSkeleton) {
      // show skeleton (defer setState), then hide after 2s if still no input
      start = setTimeout(() => setSkeletonVisible(true), 0);
      t = setTimeout(() => setSkeletonVisible(false), 2000);
    } else {
      // ensure we hide the skeleton but defer so we don't set state synchronously
      start = setTimeout(() => setSkeletonVisible(false), 0);
    }
    return () => {
      clearTimeout(start);
      clearTimeout(t);
    };
  }, [open, showSkeleton]);

  // Keep dropdown open while typing (deferred to avoid sync state change warnings)
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchTerm && searchTerm.length > 0) setOpen(true);
    }, 0);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // If suggestions appear, immediately hide the skeleton
  useEffect(() => {
    if (suggestions && suggestions.length > 0) {
      const t = setTimeout(() => setSkeletonVisible(false), 0);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [suggestions]);

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        aria-label="Search"
        type="text"
        placeholder="Search..."
        className="input input-bordered w-80"
        value={searchTerm}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit(searchTerm);
            setOpen(false);
          }
        }}
        onFocus={() => setOpen(true)}
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 mt-2 w-80 bg-base-100 border border-base-300 rounded-md shadow-lg">
          {showSkeleton && skeletonVisible ? (
            <div className="p-4 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
            </div>
          ) : suggestions.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">No matches</div>
          ) : (
            <ul className="divide-y">
              {suggestions.map((s, i) => (
                <li
                  key={`${s.term}-${i}`}
                  className="p-2 hover:bg-base-200 cursor-pointer"
                  onClick={() => {
                    selectSuggestion(s.term, s.category);
                    setOpen(false);
                  }}>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{s.term}</div>
                    {s.category && s.category !== undefined && (
                      <span className="text-xs text-gray-500">{s.category}</span>
                    )}
                  </div>
                  {s.description && <div className="text-xs text-gray-500">{s.description}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
