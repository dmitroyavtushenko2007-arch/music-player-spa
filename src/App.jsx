import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { LibraryProvider } from "./context/LibraryContext";
import { PlayerProvider } from "./context/PlayerContext";
import Header from "./components/layout/Header";
import PlayerBar from "./components/layout/PlayerBar";
import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import PlaylistDetailsPage from "./pages/PlaylistDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";

// Router обгортає App у main.jsx (а в тестах — MemoryRouter)
function App() {
  return (
    <ThemeProvider>
      <LibraryProvider>
        <PlayerProvider>
          <Header />
          <main className="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/playlists/:id" element={<PlaylistDetailsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <PlayerBar />
        </PlayerProvider>
      </LibraryProvider>
    </ThemeProvider>
  );
}

export default App;
