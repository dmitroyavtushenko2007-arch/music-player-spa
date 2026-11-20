import { useEffect, useState } from "react";

function SearchBar({ initialValue = "", onSearch }) {
  const [value, setValue] = useState(initialValue);

  // якщо рядок пошуку в URL змінився — оновлюємо поле
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <input
        type="search"
        placeholder="Назва треку або виконавець..."
        aria-label="Пошук треків"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="btn btn--accent">
        Шукати
      </button>
    </form>
  );
}

export default SearchBar;
