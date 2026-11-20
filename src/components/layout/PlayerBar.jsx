import { usePlayer } from "../../context/PlayerContext";
import ProgressBar from "../ui/ProgressBar";
import VolumeControl from "../ui/VolumeControl";

function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    togglePlay,
    playNext,
    playPrev,
    seek,
    changeVolume,
    toggleMute,
  } = usePlayer();

  const hasTrack = Boolean(currentTrack);

  return (
    <footer className="player-bar">
      <div className="player-bar__track">
        {hasTrack ? (
          <>
            {currentTrack.cover ? (
              <img className="player-bar__cover" src={currentTrack.cover} alt="" />
            ) : (
              <div className="player-bar__cover player-bar__cover--empty">🎵</div>
            )}
            <div className="player-bar__info">
              <strong>{currentTrack.title}</strong>
              <span>{currentTrack.artist}</span>
            </div>
          </>
        ) : (
          <p className="player-bar__empty">Оберіть трек для відтворення</p>
        )}
      </div>

      <div className="player-bar__center">
        <div className="player-bar__controls">
          <button
            type="button"
            className="icon-btn"
            onClick={playPrev}
            disabled={!hasTrack}
            aria-label="Попередній трек"
          >
            ⏮
          </button>
          <button
            type="button"
            className="icon-btn icon-btn--big"
            onClick={togglePlay}
            disabled={!hasTrack}
            aria-label={isPlaying ? "Пауза" : "Відтворити"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={playNext}
            disabled={!hasTrack}
            aria-label="Наступний трек"
          >
            ⏭
          </button>
        </div>
        <ProgressBar currentTime={currentTime} duration={duration} onSeek={seek} />
      </div>

      <VolumeControl
        volume={volume}
        muted={muted}
        onVolumeChange={changeVolume}
        onToggleMute={toggleMute}
      />
    </footer>
  );
}

export default PlayerBar;
