import os
import re

import yt_dlp
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from ytmusicapi import YTMusic
app = FastAPI(title="Music Player API")

# CORS, щоб фронтенд міг звертатись до сервера
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ytmusic = YTMusic()

# простий кеш посилань на аудіо: id -> (час, url)
stream_cache = {}
CACHE_SECONDS = 30 * 60


@app.get("/api/search")
def search(q: str = Query(..., min_length=1)):
    """Пошук треків. Повертає список { id, title, artist, cover, duration }."""
    try:
        results = ytmusic.search(q, filter="songs", limit=20)
    except Exception as error:
        raise HTTPException(status_code=502, detail=f"Помилка пошуку: {error}")

    tracks = []
    for item in results:
        video_id = item.get("videoId")
        if not video_id:
            continue

        artists = item.get("artists") or []
        thumbnails = item.get("thumbnails") or []

        tracks.append(
            {
                "id": video_id,
                "title": item.get("title") or "Без назви",
                "artist": artists[0]["name"] if artists else "Невідомий виконавець",
                "cover": thumbnails[-1]["url"] if thumbnails else "",
                "duration": item.get("duration_seconds") or 0,
            }
        )
    return tracks


CACHE_DIR = os.path.join(os.path.dirname(__file__), "audio_cache")
os.makedirs(CACHE_DIR, exist_ok=True)


@app.get("/api/stream/{track_id}")
def stream(track_id: str):
    """Завантажує трек через yt-dlp в кеш і віддає файл (з підтримкою перемотки)."""
    if not re.fullmatch(r"[A-Za-z0-9_-]{6,20}", track_id):
        raise HTTPException(status_code=400, detail="Некоректний id треку")

    # якщо трек уже завантажений — віддаємо одразу
    for name in os.listdir(CACHE_DIR):
        if name.startswith(track_id + ".") and not name.endswith((".part", ".ytdl")):
            return FileResponse(os.path.join(CACHE_DIR, name))

    options = {
        "format": "bestaudio[ext=m4a]/bestaudio",
        "quiet": True,
        "noplaylist": True,
        "outtmpl": os.path.join(CACHE_DIR, "%(id)s.%(ext)s"),
    }
    try:
        with yt_dlp.YoutubeDL(options) as ydl:
            info = ydl.extract_info(
                f"https://www.youtube.com/watch?v={track_id}", download=True
            )
            file_path = ydl.prepare_filename(info)
    except Exception as error:
        raise HTTPException(status_code=502, detail=f"Не вдалося отримати аудіо: {error}")

    return FileResponse(file_path)