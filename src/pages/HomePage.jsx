import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import TrackList from "../components/tracks/TrackList";

function HomePage() {
  // пошуковий запит живе в URL (?q=...), його ставить SearchBar у Header
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  // фільтри — локальний стан сторінки, передаємо їх вниз у TrackList
  const [filterText, setFilterText] = useState("");
  const [durationFilter, setDurationFilter] = useState("all");

  return (
    <section className="page">
      <h1>{query ? `Результати для «${query}»` : "Популярні треки"}</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Фільтр у результатах..."
          aria-label="Фільтр за назвою або виконавцем"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <select
          aria-label="Фільтр за тривалістю"
          value={durationFilter}
          onChange={(e) => setDurationFilter(e.target.value)}
        >
          <option value="all">Будь-яка тривалість</option>
          <option value="short">Короткі (до 3 хв)</option>
          <option value="long">Довгі (від 3 хв)</option>
        </select>
      </div>

      <TrackList
        query={query}
        filterText={filterText}
        durationFilter={durationFilter}
      />
    </section>
  );
}

export default HomePage;
