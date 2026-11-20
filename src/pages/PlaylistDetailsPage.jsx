import { Link, useParams } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import TrackList from "../components/tracks/TrackList";

function PlaylistDetailsPage() {
  const { id } = useParams();
  const { playlists, removeTrackFromPlaylist } = useLibrary();

  const playlist = playlists.find((item) => item.id === id);

  if (!playlist) {
    return (
      <section className="page">
        <h1>Плейліст не знайдено</h1>
        <Link to="/library">← До бібліотеки</Link>
      </section>
    );
  }

  return (
    <section className="page">
      <Link to="/library">← До бібліотеки</Link>
      <h1>{playlist.name}</h1>
      {playlist.description && <p className="page__subtitle">{playlist.description}</p>}

      <TrackList
        tracks={playlist.tracks}
        emptyText="У плейлісті поки немає треків"
        onRemove={(track) => removeTrackFromPlaylist(playlist.id, track.id)}
      />
    </section>
  );
}

export default PlaylistDetailsPage;
