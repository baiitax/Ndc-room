"use client";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useLocalPreference } from "@/hooks/use-local-preference";

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void }>({ theme: "system", setTheme: () => {} });
export const themeStorageKey = "kemsr.theme";

export function applyTheme(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [storedTheme, updateTheme] = useLocalPreference(themeStorageKey, "dark", ["light", "dark", "system"]);
  const theme = storedTheme as Theme;
  useEffect(() => {
    applyTheme(theme);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(theme);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);
  function setTheme(next: Theme) { updateTheme(next); applyTheme(next); }
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
