import { useLibrary } from "../context/LibraryContext";
import TrackList from "../components/tracks/TrackList";
import PlaylistForm from "../components/playlists/PlaylistForm";
import PlaylistCard from "../components/playlists/PlaylistCard";

function LibraryPage() {
  const { favorites, playlists, createPlaylist, deletePlaylist } = useLibrary();

  return (
    <section className="page">
      <h1>Моя бібліотека</h1>

      <h2>Обране</h2>
      <TrackList
        tracks={favorites}
        emptyText="Ви ще не додали жодного треку в обране"
      />

      <h2>Плейлісти</h2>
      <PlaylistForm onCreate={createPlaylist} />

      {playlists.length === 0 ? (
        <p className="empty-message">Плейлістів поки немає</p>
      ) : (
        <div className="playlist-grid">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onDelete={deletePlaylist}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default LibraryPage;
