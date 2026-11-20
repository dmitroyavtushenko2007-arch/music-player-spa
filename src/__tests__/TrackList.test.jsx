import { render, screen, fireEvent } from "@testing-library/react";
import renderer, { act } from "react-test-renderer";
import TrackList from "../components/tracks/TrackList";
import { PlayerProvider } from "../context/PlayerContext";
import { LibraryProvider } from "../context/LibraryContext";

const mockTracks = [
  { id: "t1", title: "Test Song 1", artist: "Artist A", cover: "", duration: 150 },
  { id: "t2", title: "Test Song 2", artist: "Artist B", cover: "", duration: 200 },
  { id: "t3", title: "Test Song 3", artist: "Artist A", cover: "", duration: 240 },
  { id: "t4", title: "Test Song 4", artist: "Artist C", cover: "", duration: 175 },
  { id: "t5", title: "Test Song 5", artist: "Artist B", cover: "", duration: 320 },
  { id: "t6", title: "Test Song 6", artist: "Artist D", cover: "", duration: 190 },
];

// допоміжна функція: рендер списку разом з контекстами
function renderList(props = {}) {
  return render(
    <LibraryProvider>
      <PlayerProvider>
        <TrackList {...props} />
      </PlayerProvider>
    </LibraryProvider>
  );
}

let playSpy;
let pauseSpy;

beforeEach(() => {
  localStorage.clear();

  // jsdom не вміє грати аудіо, тому мокаємо play/pause
  playSpy = jest
    .spyOn(HTMLMediaElement.prototype, "play")
    .mockImplementation(() => Promise.resolve());
  pauseSpy = jest
    .spyOn(HTMLMediaElement.prototype, "pause")
    .mockImplementation(() => Promise.resolve());

  // за замовчуванням сервер відповідає успішно
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockTracks),
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("рендерить список з принаймні 5 треків", async () => {
  renderList();

  const items = await screen.findAllByRole("listitem");
  expect(items.length).toBeGreaterThanOrEqual(5);
  expect(items).toHaveLength(mockTracks.length);
  expect(screen.getByText("Test Song 1")).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith("/api/search?q=top%20hits");
});

test("показує 'Завантаження...' поки йде запит", () => {
  // проміс, який ніколи не завершується
  global.fetch = jest.fn(() => new Promise(() => {}));
  renderList();

  expect(screen.getByText("Завантаження...")).toBeInTheDocument();
});

test("показує помилку, якщо і сервер, і fallback недоступні", async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));
  renderList();

  expect(await screen.findByText("Помилка завантаження даних")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Спробувати ще раз" })).toBeInTheDocument();
});

test("бере треки з fallback-tracks.json, якщо сервер впав", async () => {
  global.fetch = jest.fn((url) => {
    if (url.startsWith("/api/")) {
      return Promise.reject(new Error("Server is down"));
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockTracks),
    });
  });
  renderList();

  const items = await screen.findAllByRole("listitem");
  expect(items).toHaveLength(mockTracks.length);
  expect(global.fetch).toHaveBeenCalledWith("/fallback-tracks.json");
});

test("показує повідомлення, якщо список порожній", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
  );
  renderList();

  expect(await screen.findByText("Нічого не знайдено")).toBeInTheDocument();
});

test("кнопка Play запускає відтворення", async () => {
  renderList();

  const playButton = await screen.findByRole("button", {
    name: "Відтворити: Test Song 1",
  });
  fireEvent.click(playButton);

  expect(playSpy).toHaveBeenCalled();
  // після старту кнопка стає паузою
  expect(
    await screen.findByRole("button", { name: "Пауза: Test Song 1" })
  ).toBeInTheDocument();
});

test("повторний клік ставить трек на паузу", async () => {
  renderList();

  fireEvent.click(await screen.findByRole("button", { name: "Відтворити: Test Song 2" }));
  fireEvent.click(await screen.findByRole("button", { name: "Пауза: Test Song 2" }));

  expect(pauseSpy).toHaveBeenCalled();
});

test("snapshot списку треків", () => {
  let tree;
  act(() => {
    tree = renderer.create(
      <LibraryProvider>
        <PlayerProvider>
          <TrackList tracks={mockTracks} />
        </PlayerProvider>
      </LibraryProvider>
    );
  });

  expect(tree.toJSON()).toMatchSnapshot();
});
