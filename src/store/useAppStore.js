import { create } from "zustand";
import { persist } from "zustand/middleware";
import general from "../data/general.json";
import animals from "../data/animals.json";
import manhwa from "../data/manhwa.json";

const maxRecentSearches = 10;
const searchTermKey = "mongmong:searchTerm";
const categoryKey = "mongmong:category";
const themeKey = "mongmong:theme";

const wordsByCategoryInitial = {
  General: general.map((e) => e.term),
  Animals: animals.map((e) => e.term),
  Manhwa: manhwa.map((e) => e.term)
};

const allWordsInitial = Object.values(wordsByCategoryInitial).flat();

const initialSearch = typeof window !== "undefined" ? localStorage.getItem(searchTermKey) || "" : "";

const initialCategory = typeof window !== "undefined" ? localStorage.getItem(categoryKey) || "General" : "General";

const initialWords =
  initialCategory === "All" ? allWordsInitial : wordsByCategoryInitial[initialCategory] || allWordsInitial;

const useAppStore = create(
  persist(
    (set, get) => ({
      // state
      searchTerm: initialSearch,
      category: initialCategory,
      wordsByCategory: wordsByCategoryInitial,
      words: initialWords,
      recent: [],
      theme: typeof window !== "undefined" ? localStorage.getItem(themeKey) || "light" : "light",

      // actions
      setSearch: (term) => {
        if (typeof window !== "undefined") {
          if (term && term.length) localStorage.setItem(searchTermKey, term);
          else localStorage.removeItem(searchTermKey);
        }
        set({ searchTerm: term });
      },

      addRecent: (term) =>
        set((state) => ({
          recent: [term, ...state.recent.filter((t) => t !== term)].slice(0, maxRecentSearches)
        })),

      removeRecent: (term) => set((state) => ({ recent: state.recent.filter((t) => t !== term) })),

      clearRecent: () => set({ recent: [] }),

      clearSearch: () => set({ searchTerm: "" }),

      setCategory: (category) => {
        if (typeof window !== "undefined") {
          if (category) localStorage.setItem(categoryKey, category);
          else localStorage.removeItem(categoryKey);
        }
        set({ category });
      },

      setWords: (words) => set({ words }),

      setWordsByCategory: (map) => set({ wordsByCategory: map }),

      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light";
        if (typeof window !== "undefined") localStorage.setItem(themeKey, newTheme);
        set({ theme: newTheme });
      }
    }),
    {
      name: "mongmong-storage",
      partialize: (state) => ({ recent: state.recent, theme: state.theme })
    }
  )
);

export default useAppStore;
