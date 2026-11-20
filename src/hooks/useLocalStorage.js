import { useEffect, useState } from "react";

// Простий хук: працює як useState, але зберігає значення в localStorage
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // якщо localStorage недоступний — просто нічого не зберігаємо
    }
  }, [key, value]);

  return [value, setValue];
}
