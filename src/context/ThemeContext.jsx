import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

// Беремо збережену тему, за замовчуванням — світла
function getInitialTheme() {
  try {
    return localStorage.getItem("app-theme") === "dark" ? "dark" : "light";
  } catch (error) {
    return "light";
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // оновлюємо data-theme на <html> і зберігаємо вибір
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("app-theme", theme);
    } catch (error) {
      // ігноруємо
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme треба використовувати всередині ThemeProvider");
  }
  return context;
}
