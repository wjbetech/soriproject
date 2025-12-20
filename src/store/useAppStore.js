import { create } from "zustand";
import { persist } from "zustand/middleware";

const maxRecentSearches = 10;

export const useAppStore = create(
  persist(
    (set, get) => ({
      // state items
      searchItem: "",
      category: "General",
      words: [],
      recentSearches: [],
      theme: "light",

      // actions
      setSearch: (item) => {
        set({ searchItem: item });

        if (item && !get().recentSearches.includes(item)) {
          set((state) => ({
            recentSearches: [item, ...state.recentSearches].slice(0, maxRecentSearches)
          }));
        }
      },

      addRecent: (item) =>
        set((state) => ({
          recentSearches: [item, ...state.recentSearches].slice(0, maxRecentSearches)
        })),

      removeRecent: (item) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((search) => search !== item)
        })),

      clearRecent: () => set({ recentSearches: [] }),

      clearSearch: () => set({ searchItem: "" }),

      setCategory: (category) => set({ category }),

      setWords: (words) => set({ words }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light"
        }))
    }),
    {
      name: "hansori-storage",
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        theme: state.theme
      })
    }
  )
);
