import { test, expect } from "bun:test";
import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "../../components/ErrorMessage";

test("ErrorMessage - renders error message when provided", () => {
  const errorText = "Fichier trop volumineux";
  
  render(<ErrorMessage error={errorText} />);

  const errorElement = screen.getByText(`⚠️ Erreur lors de l'upload : ${errorText}`);
  expect(errorElement).toBeTruthy();
});

test("ErrorMessage - does not render when error is null", () => {
  const { container } = render(<ErrorMessage error={null} />);
  
  expect(container.firstChild).toBeNull();
});

test("ErrorMessage - does not render when error is undefined", () => {
  const { container } = render(<ErrorMessage error={undefined} />);
  
  expect(container.firstChild).toBeNull();
});

test("ErrorMessage - applies correct error styling", () => {
  const { container } = render(<ErrorMessage error="Test error" />);
  
  const errorDiv = container.firstChild as HTMLElement;
  expect(errorDiv?.classList?.contains('bg-red-600')).toBe(true);
  expect(errorDiv?.classList?.contains('text-white')).toBe(true);
});

test("ErrorMessage - handles empty string error", () => {
  const { container } = render(<ErrorMessage error="" />);
  
  // Empty string is falsy, so it should not render
  expect(container.firstChild).toBeNull();
});

test("ErrorMessage - contains warning emoji", () => {
  render(<ErrorMessage error="Test error" />);
  
  const warningEmoji = screen.getByText(/⚠️/);
  expect(warningEmoji).toBeTruthy();
});