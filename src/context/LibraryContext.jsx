import { createContext, useCallback, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  // обрані треки та плейлисти лежать у localStorage
  const [favorites, setFavorites] = useLocalStorage("favorite-tracks", []);
  const [playlists, setPlaylists] = useLocalStorage("user-playlists", []);

  function isFavorite(trackId) {
    return favorites.some((track) => track.id === trackId);
  }

  const toggleFavorite = useCallback(
    (track) => {
      setFavorites((prev) =>
        prev.some((item) => item.id === track.id)
          ? prev.filter((item) => item.id !== track.id)
          : [...prev, track]
      );
    },
    [setFavorites]
  );

  function createPlaylist(name, description) {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      description,
      tracks: [],
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
  }

  function deletePlaylist(playlistId) {
    setPlaylists((prev) => prev.filter((playlist) => playlist.id !== playlistId));
  }

  function addTrackToPlaylist(playlistId, track) {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== playlistId) return playlist;
        // не додаємо один трек двічі
        if (playlist.tracks.some((item) => item.id === track.id)) return playlist;
        return { ...playlist, tracks: [...playlist.tracks, track] };
      })
    );
  }

  function removeTrackFromPlaylist(playlistId, trackId) {
    setPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId
          ? { ...playlist, tracks: playlist.tracks.filter((item) => item.id !== trackId) }
          : playlist
      )
    );
  }

  const value = {
    favorites,
    playlists,
    isFavorite,
    toggleFavorite,
    createPlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary треба використовувати всередині LibraryProvider");
  }
  return context;
}
