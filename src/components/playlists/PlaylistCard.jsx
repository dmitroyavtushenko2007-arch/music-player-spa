import { Link } from "react-router-dom";

function PlaylistCard({ playlist, onDelete }) {
  return (
    <article className="playlist-card">
      <Link to={`/playlists/${playlist.id}`} className="playlist-card__link">
        <h3>{playlist.name}</h3>
        {playlist.description && <p>{playlist.description}</p>}
        <span className="playlist-card__count">Треків: {playlist.tracks.length}</span>
      </Link>
      <button
        type="button"
        className="icon-btn"
        onClick={() => onDelete(playlist.id)}
        aria-label={`Видалити плейліст ${playlist.name}`}
      >
        🗑
      </button>
    </article>
  );
}

export default PlaylistCard;
