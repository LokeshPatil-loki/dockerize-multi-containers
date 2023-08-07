import { render,screen } from "@testing-library/react";
import App from "./App";

import matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers);

it("should have Vite + React", () => {
    render(<App/>)
    const message = screen.queryByText(/Vite + React/i);
    expect(message).toBeDefined();
})