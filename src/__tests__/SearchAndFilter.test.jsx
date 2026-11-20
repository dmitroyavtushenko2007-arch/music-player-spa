import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

const defaultTracks = [
  { id: "t1", title: "Morning Light", artist: "Aurora Band", cover: "", duration: 150 },
  { id: "t2", title: "Night Drive", artist: "Neon City", cover: "", duration: 200 },
  { id: "t3", title: "Ocean Waves", artist: "Aurora Band", cover: "", duration: 240 },
  { id: "t4", title: "City Lights", artist: "Neon City", cover: "", duration: 175 },
  { id: "t5", title: "Quiet Forest", artist: "Green Echo", cover: "", duration: 320 },
  { id: "t6", title: "Summer Dance", artist: "Sun Club", cover: "", duration: 190 },
];

const rockTracks = [
  { id: "r1", title: "Rock Anthem", artist: "Stone Gang", cover: "", duration: 210 },
  { id: "r2", title: "Rock Night", artist: "Stone Gang", cover: "", duration: 230 },
];

function renderApp() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();

  jest
    .spyOn(HTMLMediaElement.prototype, "play")
    .mockImplementation(() => Promise.resolve());
  jest
    .spyOn(HTMLMediaElement.prototype, "pause")
    .mockImplementation(() => Promise.resolve());

  // для запиту "rock" повертаємо інший список
  global.fetch = jest.fn((url) => {
    const data = url.includes("q=rock") ? rockTracks : defaultTracks;
    return Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("пошук у шапці оновлює список треків", async () => {
  renderApp();
  expect(await screen.findByText("Morning Light")).toBeInTheDocument();

  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "rock" } });
  fireEvent.click(screen.getByRole("button", { name: "Шукати" }));

  expect(await screen.findByText("Rock Anthem")).toBeInTheDocument();
  expect(screen.getByText("Rock Night")).toBeInTheDocument();
  expect(screen.queryByText("Morning Light")).not.toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith("/api/search?q=rock");
});

test("текстовий фільтр залишає тільки потрібні треки", async () => {
  renderApp();
  await screen.findByText("Morning Light");

  fireEvent.change(screen.getByLabelText("Фільтр за назвою або виконавцем"), {
    target: { value: "aurora" },
  });

  expect(screen.getByText("Morning Light")).toBeInTheDocument();
  expect(screen.getByText("Ocean Waves")).toBeInTheDocument();
  expect(screen.queryByText("Night Drive")).not.toBeInTheDocument();
});

test("фільтр за тривалістю показує лише короткі треки", async () => {
  renderApp();
  await screen.findByText("Morning Light");

  fireEvent.change(screen.getByLabelText("Фільтр за тривалістю"), {
    target: { value: "short" },
  });

  // до 3 хвилин: 150 с і 175 с
  expect(screen.getByText("Morning Light")).toBeInTheDocument();
  expect(screen.getByText("City Lights")).toBeInTheDocument();
  expect(screen.queryByText("Night Drive")).not.toBeInTheDocument();
  expect(screen.queryByText("Quiet Forest")).not.toBeInTheDocument();
});

test("якщо нічого не знайдено — показується повідомлення", async () => {
  renderApp();
  await screen.findByText("Morning Light");

  fireEvent.change(screen.getByLabelText("Фільтр за назвою або виконавцем"), {
    target: { value: "zzzzzz" },
  });

  expect(screen.getByText("Нічого не знайдено")).toBeInTheDocument();
});
