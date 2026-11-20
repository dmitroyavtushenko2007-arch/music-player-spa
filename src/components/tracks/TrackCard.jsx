import { useState } from "react";
import { formatTime } from "../ui/ProgressBar";

// Проста картка: все, що потрібно, приходить через props
function TrackCard({
  track,
  isCurrent = false,
  isPlaying = false,
  isFavorite = false,
  playlists = [],
  onPlay,
  onToggleFavorite,
  onAddToPlaylist,
  onRemove,
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPause = isCurrent && isPlaying;

  function handlePlaylistChange(event) {
    const playlistId = event.target.value;
    if (playlistId) {
      onAddToPlaylist(playlistId, track);
    }
  }

  return (
    <article className={isCurrent ? "track-card track-card--current" : "track-card"}>
      <div className="track-card__cover">
        {track.cover && !imageFailed ? (
          <img
            src={track.cover}
            alt={`Обкладинка ${track.title}`}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span>🎵</span>
        )}
      </div>

      <div className="track-card__info">
        <h3 className="track-card__title">{track.title}</h3>
        <p className="track-card__artist">{track.artist}</p>
      </div>

      <span className="track-card__duration">{formatTime(track.duration)}</span>

      <div className="track-card__actions">
        <button
          type="button"
          className="icon-btn"
          onClick={() => onPlay(track)}
          aria-label={showPause ? `Пауза: ${track.title}` : `Відтворити: ${track.title}`}
        >
          {showPause ? "⏸" : "▶"}
        </button>

        <button
          type="button"
          className="icon-btn"
          onClick={() => onToggleFavorite(track)}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? `Прибрати з обраного: ${track.title}`
              : `Додати в обране: ${track.title}`
          }
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>

        <select
          className="playlist-select"
          value=""
          onChange={handlePlaylistChange}
          disabled={playlists.length === 0}
          aria-label={`Додати в плейліст: ${track.title}`}
        >
          <option value="">
            {playlists.length === 0 ? "Немає плейлістів" : "+ У плейліст"}
          </option>
          {playlists.map((playlist) => (
            <option key={playlist.id} value={playlist.id}>
              {playlist.name}
            </option>
          ))}
        </select>

        {onRemove && (
          <button
            type="button"
            className="icon-btn"
            onClick={() => onRemove(track)}
            aria-label={`Видалити з плейліста: ${track.title}`}
          >
            ✕
          </button>
        )}
      </div>
    </article>
  );
}

export default TrackCard;
