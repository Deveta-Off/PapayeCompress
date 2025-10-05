import { test, expect } from "bun:test";
import { render, screen } from "@testing-library/react";
import { CompressionResult } from "../../components/CompressionResult";

test("CompressionResult - renders compression success when size is reduced", () => {
  render(
    <CompressionResult
      compressedURL="blob:test"
      originalSize={1000000} // 1MB
      compressedSize={500000} // 500KB
      compressedFormat="jpeg"
    />
  );

  const successMessage = screen.getByText(/Image compressée ✅/);
  expect(successMessage).toBeTruthy();
  
  const savingsText = screen.getByText(/50% d'espace gagné 🎉/);
  expect(savingsText).toBeTruthy();
});

test("CompressionResult - renders warning when size increased", () => {
  render(
    <CompressionResult
      compressedURL="blob:test"
      originalSize={500000} // 500KB
      compressedSize={1000000} // 1MB
      compressedFormat="png"
    />
  );

  const warningMessage = screen.getByText(/Image compressée \? ⚠️/);
  expect(warningMessage).toBeTruthy();
  
  const warningEmoji = screen.getByText(/😬/);
  expect(warningEmoji).toBeTruthy();
});

test("CompressionResult - renders download link with correct attributes", () => {
  render(
    <CompressionResult
      compressedURL="blob:test-url"
      originalSize={1000000}
      compressedSize={500000}
      compressedFormat="webp"
    />
  );

  const downloadLink = screen.getByRole('link');
  expect(downloadLink).toBeTruthy();
  expect(downloadLink.getAttribute('href')).toBe('blob:test-url');
  expect(downloadLink.getAttribute('download')).toBe('compressed.webp');
});

test("CompressionResult - displays file sizes correctly", () => {
  render(
    <CompressionResult
      compressedURL="blob:test"
      originalSize={1048576} // 1MB
      compressedSize={524288}  // 512KB
      compressedFormat="jpeg"
    />
  );

  // Check if file sizes are displayed (formats to MB/KB)
  const sizeText = screen.getByText(/1.00 Mo → 512.00 Ko/);
  expect(sizeText).toBeTruthy();
});

test("CompressionResult - calculates compression ratio correctly", () => {
  render(
    <CompressionResult
      compressedURL="blob:test"
      originalSize={1000}
      compressedSize={250}
      compressedFormat="jpeg"
    />
  );

  // 75% compression (250 is 25% of 1000, so 75% saved)
  const compressionRatio = screen.getByText(/75% d'espace gagné/);
  expect(compressionRatio).toBeTruthy();
});

test("CompressionResult - applies correct styling for success", () => {
  const { container } = render(
    <CompressionResult
      compressedURL="blob:test"
      originalSize={1000}
      compressedSize={500}
      compressedFormat="jpeg"
    />
  );

  const resultDiv = container.firstChild as HTMLElement | null;
  expect(resultDiv?.classList?.contains('bg-green-50')).toBe(true);
  expect(resultDiv?.classList?.contains('border-green-200')).toBe(true);
});

test("CompressionResult - applies correct styling for warning", () => {
  const { container } = render(
    <CompressionResult
      compressedURL="blob:test"
      originalSize={500}
      compressedSize={1000}
      compressedFormat="jpeg"
    />
  );

  const resultDiv = container.firstChild as HTMLElement | null;
  expect(resultDiv?.classList?.contains('bg-red-50')).toBe(true);
  expect(resultDiv?.classList?.contains('border-red-200')).toBe(true);
});