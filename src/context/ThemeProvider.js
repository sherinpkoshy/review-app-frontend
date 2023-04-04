import React, { createContext, useEffect } from "react";

export const ThemeContext = createContext();

const defaultTheme = "light";
const darkTheme = "dark";

export default function ThemeProvider({ children }) {
  const toggleTheme = () => {
    const oldTheme = getTheme();
    const newTheme =
      oldTheme === null || oldTheme === defaultTheme ? darkTheme : defaultTheme;
    document.documentElement.classList.remove(oldTheme);
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const theme = getTheme();
    document.documentElement.classList.add(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

const getTheme = () => localStorage.getItem("theme");
