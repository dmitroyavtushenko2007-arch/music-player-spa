import { useTheme } from "../../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      className="btn theme-toggle"
      onClick={toggleTheme}
      aria-label={isLight ? "Увімкнути темну тему" : "Увімкнути світлу тему"}
    >
      {isLight ? "🌙 Темна" : "☀️ Світла"}
    </button>
  );
}

export default ThemeToggle;
