import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle from "../components/ui/ThemeToggle";
import { ThemeProvider } from "../context/ThemeContext";

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

test("за замовчуванням стоїть світла тема", () => {
  renderToggle();

  expect(document.documentElement).toHaveAttribute("data-theme", "light");
});

test("перемикається light -> dark -> light", () => {
  renderToggle();
  const button = screen.getByRole("button");

  fireEvent.click(button);
  expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  expect(localStorage.getItem("app-theme")).toBe("dark");

  fireEvent.click(button);
  expect(document.documentElement).toHaveAttribute("data-theme", "light");
  expect(localStorage.getItem("app-theme")).toBe("light");
});

test("бере збережену тему з localStorage", () => {
  localStorage.setItem("app-theme", "dark");
  renderToggle();

  expect(document.documentElement).toHaveAttribute("data-theme", "dark");
});
