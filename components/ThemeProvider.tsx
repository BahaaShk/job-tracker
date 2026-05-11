"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "light", toggle: () => {} });

// This function runs ONCE to get the initial theme value before React renders anything.
// We pass it directly to useState as an initializer function.
function getInitialTheme(): Theme {
  // typeof window check is needed because Next.js tries to run this on the server too.
  // localStorage and window don't exist on the server — this guard prevents a crash.
  if (typeof window === "undefined") return "light";

  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored) return stored;
  // If there's a saved preference, use it immediately — no need to check OS.

  // No saved preference — fall back to OS setting.
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Passing a function to useState instead of a value is called "lazy initialization".
  // React calls getInitialTheme() only once on first render, not on every re-render.
  // This means the correct theme is known before the first paint — no blink.
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // useEffect now only syncs the <html> class with the current theme.
  // This is the correct use of useEffect — syncing React state to an external system (the DOM).
  // No setState call here, so no cascading render warning.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  // Runs whenever theme changes — on first mount and every toggle.

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });
    // localStorage write moved here — keeps the effect clean and single-purpose.
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);