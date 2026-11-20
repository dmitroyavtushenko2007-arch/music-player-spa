// Запит за замовчуванням, коли пошуковий рядок порожній
const DEFAULT_QUERY = "top hits";

// Приводимо будь-який трек до єдиного вигляду { id, title, artist, cover, duration }
export function normalizeTrack(raw) {
  const thumbnails = raw.thumbnails || [];
  const artist =
    raw.artist ||
    (raw.artists && raw.artists[0] && raw.artists[0].name) ||
    "Невідомий виконавець";

  const track = {
    id: raw.id || raw.videoId,
    title: raw.title || "Без назви",
    artist,
    cover:
      raw.cover ||
      raw.thumbnail ||
      (thumbnails.length > 0 ? thumbnails[thumbnails.length - 1].url : "") ||
      "",
    duration: Number(raw.duration ?? raw.duration_seconds) || 0,
  };

  // у резервних треків є прямий mp3, у серверних — ні
  if (raw.audioUrl) {
    track.audioUrl = raw.audioUrl;
  }
  return track;
}

// Адреса бекенда: на деплої береться з VITE_API_URL, локально порожня (працює proxy)
const API_URL = typeof __API_URL__ !== "undefined" ? __API_URL__ : "";

// Адреса аудіо: прямий mp3 (fallback) або наш /api/stream
export function getStreamUrl(track) {
  return track.audioUrl || `${API_URL}/api/stream/${track.id}`;
}

// Резервні дані, якщо сервер не працює
async function loadFallback(query) {
  const response = await fetch("/fallback-tracks.json");
  if (!response.ok) {
    throw new Error("Не вдалося завантажити резервні дані");
  }
  const data = await response.json();
  const tracks = data.map(normalizeTrack);

  // якщо користувач щось шукав — фільтруємо резервний список
  const text = query.toLowerCase();
  if (!text) {
    return tracks;
  }
  return tracks.filter(
    (track) =>
      track.title.toLowerCase().includes(text) ||
      track.artist.toLowerCase().includes(text)
  );
}

export async function searchTracks(query = "") {
  const q = query.trim();

  try {
    const response = await fetch(
      `${API_URL}/api/search?q=${encodeURIComponent(q || DEFAULT_QUERY)}`
    );
    if (!response.ok) {
      throw new Error("Сервер повернув помилку");
    }
    const data = await response.json();
    const list = Array.isArray(data) ? data : data.results;
    if (!Array.isArray(list)) {
      throw new Error("Невірний формат відповіді");
    }
    return list.map(normalizeTrack).filter((track) => track.id);
  } catch (error) {
    // будь-яка проблема з сервером -> беремо fallback
    return loadFallback(q);
  }
}
