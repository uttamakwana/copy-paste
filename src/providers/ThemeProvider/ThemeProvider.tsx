import { PropsWithChildren, useState } from "react";
import { ThemeContext, TThemeContext } from "./context";

type TThemeProviderProps = PropsWithChildren;
export const ThemeProvider = ({ children }: TThemeProviderProps) => {
  const [theme, setTheme] = useState<TThemeContext["theme"]>(() => {
    const userPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return userPrefersDark ? "dark" : "light";
  });

  function toggleTheme(theme?: TThemeContext["theme"]) {
    setTheme((prev) =>
      typeof theme === "string" ? theme : prev === "dark" ? "light" : "dark"
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
