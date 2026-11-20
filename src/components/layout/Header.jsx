import { useCallback } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "../ui/SearchBar";
import ThemeToggle from "../ui/ThemeToggle";

function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  // пошук = перехід на головну з параметром ?q=
  const handleSearch = useCallback(
    (text) => {
      navigate(text ? `/?q=${encodeURIComponent(text)}` : "/");
    },
    [navigate]
  );

  function getLinkClass({ isActive }) {
    return isActive ? "nav-link nav-link--active" : "nav-link";
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="logo">
          MusicPlayer
        </Link>

        <nav className="nav">
          <NavLink to="/" end className={getLinkClass}>
            Головна
          </NavLink>
          <NavLink to="/library" className={getLinkClass}>
            Бібліотека
          </NavLink>
        </nav>

        <SearchBar initialValue={query} onSearch={handleSearch} />
        <ThemeToggle />
      </div>
    </header>
  );
}

export default Header;
