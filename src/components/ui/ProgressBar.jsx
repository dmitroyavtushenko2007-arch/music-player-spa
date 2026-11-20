// 215 -> "3:35"
export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${rest < 10 ? "0" : ""}${rest}`;
}

function ProgressBar({ currentTime, duration, onSeek }) {
  const max = duration > 0 ? duration : 0;

  return (
    <div className="progress">
      <span className="progress__time">{formatTime(currentTime)}</span>
      <input
        type="range"
        min="0"
        max={max}
        step="1"
        value={Math.min(currentTime, max)}
        onChange={(e) => onSeek(Number(e.target.value))}
        disabled={max === 0}
        aria-label="Перемотка"
      />
      <span className="progress__time">{formatTime(max)}</span>
    </div>
  );
}

export default ProgressBar;
