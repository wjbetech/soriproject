import { create } from "zustand";
import { persist } from "zustand/middleware";
import general from "../data/general.json";
import animals from "../data/animals.json";
import manhwa from "../data/manhwa.json";

const MAX_RECENT_SEARCHES = 10;

const wordsByCategoryInitial = {
  General: general.map((e) => e.term),
  Animals: animals.map((e) => e.term),
  Manhwa: manhwa.map((e) => e.term)
};

const allWordsInitial = Object.values(wordsByCategoryInitial).flat();

const useAppStore = create(
  persist(
    (set, get) => ({
      // state
      searchTerm: "",
      category: "General",
      wordsByCategory: wordsByCategoryInitial,
      words: allWordsInitial,
      recent: [],
      theme: "light",

      // actions
      setSearch: (term) => {
        set({ searchTerm: term });

        if (term && !get().recent.includes(term)) {
          set((state) => ({
            recent: [term, ...state.recent].slice(0, MAX_RECENT_SEARCHES)
          }));
        }
      },

      addRecent: (term) =>
        set((state) => ({
          recent: [term, ...state.recent.filter((t) => t !== term)].slice(0, MAX_RECENT_SEARCHES)
        })),

      removeRecent: (term) => set((state) => ({ recent: state.recent.filter((t) => t !== term) })),

      clearRecent: () => set({ recent: [] }),

      clearSearch: () => set({ searchTerm: "" }),

      setCategory: (category) => set({ category }),

      setWords: (words) => set({ words }),

      setWordsByCategory: (map) => set({ wordsByCategory: map }),

      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" }))
    }),
    {
      name: "hansori-storage",
      partialize: (state) => ({ recent: state.recent, theme: state.theme })
    }
  )
);

export default useAppStore;
