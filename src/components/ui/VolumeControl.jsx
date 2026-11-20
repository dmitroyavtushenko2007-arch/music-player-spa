function VolumeControl({ volume, muted, onVolumeChange, onToggleMute }) {
  const shownVolume = muted ? 0 : volume;
  let icon = "🔊";
  if (shownVolume === 0) icon = "🔇";
  else if (shownVolume < 0.5) icon = "🔉";

  return (
    <div className="volume">
      <button
        type="button"
        className="icon-btn"
        onClick={onToggleMute}
        aria-label={muted ? "Увімкнути звук" : "Вимкнути звук"}
      >
        {icon}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={shownVolume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        aria-label="Гучність"
      />
    </div>
  );
}

export default VolumeControl;
