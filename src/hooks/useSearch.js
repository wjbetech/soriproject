import { useMemo } from "react";
import useAppStore from "../store/useAppStore";

export default function useSearch() {
  const searchTerm = useAppStore((s) => s.searchTerm);
  const setSearch = useAppStore((s) => s.setSearch);
  const category = useAppStore((s) => s.category);
  const wordsByCategory = useAppStore((s) => s.wordsByCategory);
  const addRecent = useAppStore((s) => s.addRecent);
  const recent = useAppStore((s) => s.recent);

  const results = useMemo(() => {
    if (!searchTerm) return [];
    const q = searchTerm.toLowerCase();
    const list = (wordsByCategory && wordsByCategory[category]) || [];
    return list.filter((w) => w.toLowerCase().includes(q));
  }, [searchTerm, category, wordsByCategory]);

  const submit = (term) => {
    setSearch(term);
    addRecent(term);
  };

  return { searchTerm, setSearch, results, submit, recent };
}
