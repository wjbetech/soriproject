import { useMemo } from "react";
import useAppStore from "../store/useAppStore";

export default function useSearch() {
  const searchTerm = useAppStore((s) => s.searchTerm);
  const setSearch = useAppStore((s) => s.setSearch);
  const words = useAppStore((s) => s.words);
  const addRecent = useAppStore((s) => s.addRecent);
  const recent = useAppStore((s) => s.recent);

  const results = useMemo(() => {
    if (!searchTerm) return [];
    const q = searchTerm.toLowerCase();
    return words.filter((w) => w.toLowerCase().includes(q));
  }, [searchTerm, words]);

  const submit = (term) => {
    setSearch(term);
    addRecent(term);
  };

  return { searchTerm, setSearch, results, submit, recent };
}
