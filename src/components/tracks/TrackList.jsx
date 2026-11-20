import { useEffect, useMemo, useState } from "react";
import { searchTracks } from "../../api/musicApi";
import { usePlayer } from "../../context/PlayerContext";
import { useLibrary } from "../../context/LibraryContext";
import Loading from "../ui/Loading";
import ErrorMessage from "../ui/ErrorMessage";
import TrackCard from "./TrackCard";

// Два режими:
// 1) без tracks — сам завантажує треки з API за query
// 2) з tracks — просто показує готовий список (обране, плейліст)
function TrackList({
  query = "",
  filterText = "",
  durationFilter = "all",
  tracks: staticTracks,
  emptyText = "Нічого не знайдено",
  onRemove,
}) {
  const isStatic = Array.isArray(staticTracks);

  const [remoteTracks, setRemoteTracks] = useState([]);
  const [loading, setLoading] = useState(!isStatic);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const { currentTrack, isPlaying, playTrack } = usePlayer();
  const { playlists, isFavorite, toggleFavorite, addTrackToPlaylist } = useLibrary();

  // завантаження з API (fallback всередині musicApi)
  useEffect(() => {
    if (isStatic) return;

    let ignore = false; // щоб не оновлювати стан після зміни запиту
    setLoading(true);
    setError(false);

    searchTracks(query)
      .then((data) => {
        if (!ignore) {
          setRemoteTracks(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [query, reloadKey, isStatic]);

  const baseTracks = isStatic ? staticTracks : remoteTracks;

  // фільтр за текстом і тривалістю
  const visibleTracks = useMemo(() => {
    const text = filterText.trim().toLowerCase();

    return baseTracks.filter((track) => {
      const matchText =
        !text ||
        track.title.toLowerCase().includes(text) ||
        track.artist.toLowerCase().includes(text);

      const matchDuration =
        durationFilter === "all" ||
        (durationFilter === "short" && track.duration < 180) ||
        (durationFilter === "long" && track.duration >= 180);

      return matchText && matchDuration;
    });
  }, [baseTracks, filterText, durationFilter]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage onRetry={() => setReloadKey((key) => key + 1)} />;
  }

  if (visibleTracks.length === 0) {
    return <p className="empty-message">{emptyText}</p>;
  }

  return (
    <ul className="track-list">
      {visibleTracks.map((track) => (
        <li key={track.id}>
          <TrackCard
            track={track}
            isCurrent={Boolean(currentTrack) && currentTrack.id === track.id}
            isPlaying={isPlaying}
            isFavorite={isFavorite(track.id)}
            playlists={playlists}
            // поточний список стає чергою плеєра
            onPlay={(item) => playTrack(item, visibleTracks)}
            onToggleFavorite={toggleFavorite}
            onAddToPlaylist={addTrackToPlaylist}
            onRemove={onRemove}
          />
        </li>
      ))}
    </ul>
  );
}

export default TrackList;
