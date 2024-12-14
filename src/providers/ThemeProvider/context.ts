import { createContext } from 'react';

export type TThemeContext = {
  theme: "dark" | "light";
  toggleTheme: (theme: TThemeContext["theme"]) => void;
};
export const ThemeContext = createContext<TThemeContext | null>(null);
