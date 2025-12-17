import { useTheme } from "../hooks/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-lg border
                 bg-gray-200 dark:bg-gray-800
                 text-black dark:text-white
                 transition"
    >
      {theme !== "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

export default ThemeToggle;
