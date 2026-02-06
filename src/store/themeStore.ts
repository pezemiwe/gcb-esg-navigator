import { create } from "zustand";
import { persist } from "zustand/middleware";
interface ThemeState {
  mode: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (mode: "light" | "dark") => void;
}
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "light",
      toggleTheme: () =>
        set((state) => {
          const newMode = state.mode === "light" ? "dark" : "light";
          if (newMode === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { mode: newMode };
        }),
      setTheme: (mode) => {
        if (mode === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        set({ mode });
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.mode === "dark") {
          document.documentElement.classList.add("dark");
        }
      },
    },
  ),
);