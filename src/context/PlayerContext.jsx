import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getStreamUrl } from "../api/musicApi";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  // один-єдиний <audio> на весь застосунок
  const audioRef = useRef(null);

  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  const currentTrack = currentIndex >= 0 ? queue[currentIndex] || null : null;

  // запускаємо відтворення і ловимо помилки браузера
  function tryPlay() {
    const audio = audioRef.current;
    if (!audio) return;

    const promise = audio.play();
    setIsPlaying(true);
    if (promise && promise.catch) {
      promise.catch((error) => {
        // AbortError — просто швидко змінили трек, це нормально
        if (error && error.name === "AbortError") return;
        setIsPlaying(false);
      });
    }
  }

  // коли змінився трек — міняємо src і граємо
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = getStreamUrl(currentTrack);
    setCurrentTime(0);
    setDuration(currentTrack.duration || 0);
    tryPlay();
  }, [currentTrack?.id]);

  // синхронізуємо гучність з <audio>
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      tryPlay();
    }
  }

  // list — список, з якого запустили трек (стане чергою)
  function playTrack(track, list = [track]) {
    if (currentTrack && currentTrack.id === track.id) {
      togglePlay();
      return;
    }
    const index = list.findIndex((item) => item.id === track.id);
    if (index === -1) {
      setQueue([track]);
      setCurrentIndex(0);
    } else {
      setQueue(list);
      setCurrentIndex(index);
    }
  }

  function playNext() {
    if (queue.length === 0) return;
    if (queue.length === 1) {
      // єдиний трек — програємо ще раз
      if (audioRef.current) audioRef.current.currentTime = 0;
      tryPlay();
      return;
    }
    setCurrentIndex((prev) => (prev + 1) % queue.length);
  }

  function playPrev() {
    if (queue.length === 0) return;
    const audio = audioRef.current;
    // якщо трек грає вже довго — спочатку просто перемотуємо на початок
    if (queue.length === 1 || (audio && audio.currentTime > 3)) {
      if (audio) audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    setCurrentIndex((prev) => (prev - 1 + queue.length) % queue.length);
  }

  function seek(time) {
    if (audioRef.current) audioRef.current.currentTime = time;
    setCurrentTime(time);
  }

  function changeVolume(newVolume) {
    setVolume(newVolume);
    setMuted(false);
  }

  function toggleMute() {
    if (muted || volume === 0) {
      setMuted(false);
      if (volume === 0) setVolume(0.5);
    } else {
      setMuted(true);
    }
  }

  const value = {
    currentTrack,
    queue,
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    playTrack,
    togglePlay,
    playNext,
    playPrev,
    seek,
    changeVolume,
    toggleMute,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          const realDuration = e.currentTarget.duration;
          if (Number.isFinite(realDuration)) setDuration(realDuration);
        }}
        onPlay={() => setIsPlaying(true)}
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={playNext}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer треба використовувати всередині PlayerProvider");
  }
  return context;
}
