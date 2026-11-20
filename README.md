# Music Player SPA

Мінімалістичний веб-плеєр: пошук треків, відтворення, обране, власні плейлісти, світла й темна теми.
Навчальний фінальний проєкт з React (тема «Music Playlist»), також містить тести для ЛР №8.

- **Фронтенд:** Vite + React 18, react-router-dom, Context API, звичайний CSS
- **Бекенд:** Python 3.10+, FastAPI, Uvicorn, ytmusicapi, yt-dlp
- **Тести:** Jest + React Testing Library + react-test-renderer
- **Деплой:** фронтенд — Netlify, бекенд — Render

**Онлайн-версія**

- Сайт: https://music-player-spa.netlify.app
- API: https://music-player-spa.onrender.com (перевірка: `/api/search?q=queen`)

> Бекенд працює на безкоштовному тарифі Render: після 15 хвилин без запитів він «засинає»,
> тому перший запит може тривати близько хвилини. Перший Play нового треку теж довший за інші —
> сервер спочатку завантажує файл.

---

## Що потрібно встановити (один раз)

| Програма | Навіщо | Перевірка |
| --- | --- | --- |
| [Node.js](https://nodejs.org) (LTS) | запуск фронтенду і тестів | `node -v` |
| [Python 3.10+](https://www.python.org/downloads/) | запуск сервера | `py --version` |
| [Deno](https://deno.com) | потрібен `yt-dlp` для звуку з YouTube | `deno --version` |

Deno на Windows ставиться однією командою: `winget install DenoLand.Deno` (після цього перезапустіть термінал).

---

## Перший запуск (локально)

Потрібні **два термінали**. Усі команди — для Windows PowerShell.

### Термінал 1 — сервер (папка `server/`)

```powershell
cd server
py -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

Сервер запрацював, коли в консолі з'явилось `Application startup complete`.
Швидка перевірка: відкрийте в браузері `http://127.0.0.1:8000/api/search?q=queen` — має прийти JSON зі списком треків.

> Використовуємо `.venv\Scripts\python.exe`, а не просто `python`, щоб запускався саме Python із віртуального середовища.

### Термінал 2 — фронтенд (корінь проєкту)

```powershell
npm install
npm run dev
```

Відкрийте адресу, яку покаже Vite (зазвичай `http://localhost:5173`).
Локально запити на `/api` автоматично йдуть на `http://127.0.0.1:8000` (proxy у `vite.config.js`).

> Відкривайте сайт у **Chrome / Edge / Firefox**. У вбудованому Simple Browser з VS Code звук може не працювати.

---

## Щоденний запуск

Установлення вже зроблено, тому потрібні лише дві команди (по одній у кожному терміналі):

```powershell
# термінал 1
cd server
.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000

# термінал 2 (з кореня проєкту)
npm run dev
```

Або запускайте подвійним кліком файли `server/start-server.bat` та `start-client.bat`.
Зупинити будь-який із серверів — `Ctrl + C`.

---

## Тести

```powershell
npm test
```

| Файл | Що перевіряє |
| --- | --- |
| `TrackList.test.jsx` | ≥ 5 треків, «Завантаження...», помилка, fallback, порожній список, Play/Pause, snapshot |
| `TrackCard.test.jsx` | рендер картки, клік Play, лайк, додавання в плейліст, snapshot |
| `SearchAndFilter.test.jsx` | оновлення списку при пошуку та фільтрах |
| `ThemeToggle.test.jsx` | перемикання light ↔ dark, збереження теми |

Snapshot-файли створюються автоматично при першому запуску (`src/__tests__/__snapshots__`).

---

## Як це працює

- Пошук іде через `GET /api/search?q=...` (ytmusicapi), звук — через `GET /api/stream/{track_id}`.
- Під час першого відтворення треку сервер завантажує його через `yt-dlp` у папку `server/audio_cache/`
  (тому перший Play може тривати кілька секунд), далі віддає файл. Цю папку можна безпечно видаляти.
  На Render файлова система тимчасова, тому кеш очищується під час перезапуску сервісу.
- Адреса бекенда на фронтенді береться зі змінної `VITE_API_URL` (під час збірки). Локально вона порожня, працює proxy.
- Якщо сервер не відповідає або пошук упав, застосунок бере треки з `public/fallback-tracks.json`
  (8 демо-треків, вони грають через публічні mp3).
- У `localStorage` зберігаються: `app-theme` (тема), `favorite-tracks` (обране), `user-playlists` (плейлісти).

---

## Деплой

Схема: бекенд на **Render**, фронтенд на **Netlify**. Спочатку розгортається бекенд, потім фронтенд.

### 1. Бекенд на Render

1. Завантажте проєкт на GitHub.
2. Render → **New** → **Web Service** → оберіть репозиторій.
3. Налаштування:

   | Поле | Значення |
   | --- | --- |
   | Root Directory | `server` |
   | Build Command | `pip install -r requirements.txt` |
   | Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
   | Instance Type | Free |

4. Після деплою перевірте `https://<ваш-сервіс>.onrender.com/api/search?q=queen` — має прийти JSON.

#### Cookies для YouTube (Secret File)

IP-адреси Render часто блокуються YouTube, тоді `/api/stream/...` повертає помилку
`Sign in to confirm you're not a bot`. Вирішується cookies від окремого (необов'язково основного) акаунта Google:

1. У **окремому профілі браузера** увійдіть на YouTube цим акаунтом і відкрийте `https://www.youtube.com/robots.txt`.
2. Розширенням «Get cookies.txt LOCALLY» експортуйте cookies для `youtube.com` у файл `cookies.txt`.
3. Після експорту не користуйтесь YouTube у цьому профілі (інакше cookies оновляться й перестануть діяти).
4. Render → сервіс → **Environment** → **Secret Files** → **Add Secret File**:
   ім'я `cookies.txt`, вміст — текст з файлу. Збережіть, сервіс перезапуститься.

Код сам підхоплює файл `/etc/secrets/cookies.txt`, якщо він є.

> **Ніколи не додавайте `cookies.txt` до репозиторію** — у ньому дані для входу в акаунт.
> Файл і папка `audio_cache/` мають бути в `.gitignore`.
> Cookies діють обмежений час: якщо знову з'явилась помилка про бота, експортуйте їх заново й замініть Secret File.

### 2. Фронтенд на Netlify

1. Netlify → **Add new site** → **Import an existing project** → GitHub → цей репозиторій.
2. Налаштування збірки:

   | Поле | Значення |
   | --- | --- |
   | Build command | `npm run build` |
   | Publish directory | `dist` |

3. **Environment variables** → додайте `VITE_API_URL` = адреса бекенда на Render
   (наприклад, `https://music-player-spa.onrender.com`, без `/` в кінці).
4. Запустіть деплой. Якщо змінну додали після першої збірки — **Deploys → Trigger deploy → Clear cache and deploy site**
   (Vite вшиває значення під час збірки).

`public/_redirects` потрібен Netlify, щоб маршрути на кшталт `/library` працювали після оновлення сторінки.
Для Vercel, якщо маршрути видають 404, додайте `vercel.json`:
`{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`.

---

## Часті проблеми

| Проблема | Що робити |
| --- | --- |
| `No module named uvicorn` | запускайте через `.venv\Scripts\python.exe -m uvicorn ...`, а не через `python` |
| Попередження `script is not on PATH` під час `pip install` | це не помилка, ігноруйте |
| Попередження `No supported JavaScript runtime` | встановіть Deno (`winget install DenoLand.Deno`) і перезапустіть сервер |
| Звуку немає, у Network `403` | оновіть: `.venv\Scripts\python.exe -m pip install -U "yt-dlp[default]"` і перезапустіть сервер |
| Звуку немає у VS Code | відкрийте сайт у звичайному браузері |
| На деплої `502` на `/api/stream/...` і в тексті відповіді `Sign in to confirm you're not a bot` | оновіть cookies (розділ «Cookies для YouTube») |
| На деплої у списку лише 8 демо-треків | сервер не відповів: перевірте `VITE_API_URL` у Netlify (і зробіть повторний деплой), а також що Render прокинувся |
| Перший запит після паузи дуже довгий | безкоштовний Render «прокидається» близько хвилини — це нормально |
| `npm audit` показує вразливості | це залежності для розробки; `npm audit fix --force` не запускайте — він може зламати проєкт |

## Структура

```text
music-player-spa/
├─ server/                 # FastAPI: main.py, requirements.txt, start-server.bat
├─ public/                 # fallback-tracks.json, _redirects
├─ src/
│  ├─ api/                 # musicApi.js
│  ├─ context/             # ThemeContext, PlayerContext, LibraryContext
│  ├─ hooks/               # useLocalStorage
│  ├─ components/          # layout, tracks, playlists, ui
│  ├─ pages/               # Home, Library, PlaylistDetails, NotFound
│  ├─ styles/              # variables.css, global.css
│  ├─ __tests__/           # тести
│  ├─ App.jsx
│  └─ main.jsx
├─ vite.config.js
└─ README.md
```
