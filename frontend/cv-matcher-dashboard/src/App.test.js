import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders AI CV Matcher heading", () => {
  render(<App />);
  const heading = screen.getByText(/AI CV Matcher/i);
  expect(heading).toBeInTheDocument();
});
