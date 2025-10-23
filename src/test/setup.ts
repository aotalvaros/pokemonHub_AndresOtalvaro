import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

beforeEach(() => {
  vi.mock("react-redux", async () => {
    const actual = await vi.importActual("react-redux");
    return {
      ...actual,
      useDispatch: () => vi.fn(),
      useSelector: vi.fn(),
    };
  });
});

afterEach(() => {
  cleanup();
});
