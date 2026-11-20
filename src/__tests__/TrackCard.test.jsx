import { render, screen, fireEvent } from "@testing-library/react";
import renderer from "react-test-renderer";
import TrackCard from "../components/tracks/TrackCard";

const track = {
  id: "abc123",
  title: "Test Song",
  artist: "Test Artist",
  cover: "https://example.com/cover.jpg",
  duration: 215,
};

const playlists = [{ id: "p1", name: "Мій плейліст", description: "", tracks: [] }];

// кожному тесту — свіжі mock-функції
function getProps() {
  return {
    track,
    isCurrent: false,
    isPlaying: false,
    isFavorite: false,
    playlists,
    onPlay: jest.fn(),
    onToggleFavorite: jest.fn(),
    onAddToPlaylist: jest.fn(),
  };
}

test("рендерить назву, виконавця і тривалість", () => {
  render(<TrackCard {...getProps()} />);

  expect(screen.getByText("Test Song")).toBeInTheDocument();
  expect(screen.getByText("Test Artist")).toBeInTheDocument();
  expect(screen.getByText("3:35")).toBeInTheDocument();
});

test("клік на Play викликає onPlay з треком", () => {
  const props = getProps();
  render(<TrackCard {...props} />);

  fireEvent.click(screen.getByRole("button", { name: "Відтворити: Test Song" }));

  expect(props.onPlay).toHaveBeenCalledTimes(1);
  expect(props.onPlay).toHaveBeenCalledWith(track);
});

test("якщо трек грає — кнопка показує паузу", () => {
  render(<TrackCard {...getProps()} isCurrent={true} isPlaying={true} />);

  expect(screen.getByRole("button", { name: "Пауза: Test Song" })).toBeInTheDocument();
});

test("клік на сердечко викликає onToggleFavorite", () => {
  const props = getProps();
  render(<TrackCard {...props} />);

  fireEvent.click(screen.getByRole("button", { name: "Додати в обране: Test Song" }));

  expect(props.onToggleFavorite).toHaveBeenCalledWith(track);
});

test("вибір плейліста викликає onAddToPlaylist", () => {
  const props = getProps();
  render(<TrackCard {...props} />);

  fireEvent.change(screen.getByLabelText("Додати в плейліст: Test Song"), {
    target: { value: "p1" },
  });

  expect(props.onAddToPlaylist).toHaveBeenCalledWith("p1", track);
});

test("snapshot картки треку", () => {
  const tree = renderer.create(<TrackCard {...getProps()} />).toJSON();
  expect(tree).toMatchSnapshot();
});
