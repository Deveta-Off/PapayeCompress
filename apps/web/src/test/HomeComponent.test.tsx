import { describe, it, expect, beforeAll, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomeComponent from "../routes/index";

beforeAll(() => {
  global.URL.createObjectURL = vi.fn(() => "mocked-url");
});

const queryClient = new QueryClient();
function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

// Main behaviour tests
describe("HomeComponent - Main behaviour", () => {
  it("changes quality value when slider is moved", () => {
    renderWithProviders(<HomeComponent />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveValue("50");
    fireEvent.change(slider, { target: { value: "80" } });
    expect(slider).toHaveValue("80");
    expect(screen.getByText(/80%/)).toBeInTheDocument();
  });
});
