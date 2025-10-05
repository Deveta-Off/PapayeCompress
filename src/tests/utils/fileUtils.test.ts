import { test, expect } from "bun:test";

// File size formatting utility (extracted from CompressionResult component)
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " O";
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(2) + " Ko";
  const mb = kb / 1024;
  if (mb < 1024) return mb.toFixed(2) + " Mo";
  const gb = mb / 1024;
  return gb.toFixed(2) + " Go";
}

// Compression ratio calculation utility
function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
  return 100 - Math.round((compressedSize * 100) / originalSize);
}

test("formatFileSize - formats bytes correctly", () => {
  expect(formatFileSize(500)).toBe("500 O");
  expect(formatFileSize(0)).toBe("0 O");
  expect(formatFileSize(1023)).toBe("1023 O");
});

test("formatFileSize - formats kilobytes correctly", () => {
  expect(formatFileSize(1024)).toBe("1.00 Ko");
  expect(formatFileSize(2048)).toBe("2.00 Ko");
  expect(formatFileSize(1536)).toBe("1.50 Ko");
});

test("formatFileSize - formats megabytes correctly", () => {
  expect(formatFileSize(1048576)).toBe("1.00 Mo");  // 1MB
  expect(formatFileSize(2097152)).toBe("2.00 Mo");  // 2MB
  expect(formatFileSize(1572864)).toBe("1.50 Mo");  // 1.5MB
});

test("formatFileSize - formats gigabytes correctly", () => {
  expect(formatFileSize(1073741824)).toBe("1.00 Go");  // 1GB
  expect(formatFileSize(2147483648)).toBe("2.00 Go");  // 2GB
});

test("calculateCompressionRatio - calculates correctly for compression", () => {
  expect(calculateCompressionRatio(1000, 500)).toBe(50);  // 50% compression
  expect(calculateCompressionRatio(1000, 250)).toBe(75);  // 75% compression
  expect(calculateCompressionRatio(1000, 750)).toBe(25);  // 25% compression
});

test("calculateCompressionRatio - handles no compression", () => {
  expect(calculateCompressionRatio(1000, 1000)).toBe(0);  // No compression
});

test("calculateCompressionRatio - handles size increase", () => {
  expect(calculateCompressionRatio(500, 1000)).toBe(-100);  // Size doubled
  expect(calculateCompressionRatio(1000, 1500)).toBe(-50);  // 50% increase
});

test("calculateCompressionRatio - handles edge cases", () => {
  expect(calculateCompressionRatio(1, 0)).toBe(100);  // Complete compression
  expect(calculateCompressionRatio(100, 1)).toBe(99);   // 99% compression
});

test("file validation - checks file size limits", () => {
  const maxSize = 2e7; // 20MB
  
  function isValidFileSize(size: number): boolean {
    return size <= maxSize;
  }
  
  expect(isValidFileSize(1000000)).toBe(true);   // 1MB - valid
  expect(isValidFileSize(maxSize)).toBe(true);   // Exactly 20MB - valid  
  expect(isValidFileSize(maxSize + 1)).toBe(false); // Over 20MB - invalid
});

test("file validation - checks file type", () => {
  function isValidImageType(type: string): boolean {
    return type.startsWith("image/");
  }
  
  expect(isValidImageType("image/jpeg")).toBe(true);
  expect(isValidImageType("image/png")).toBe(true);
  expect(isValidImageType("image/webp")).toBe(true);
  expect(isValidImageType("text/plain")).toBe(false);
  expect(isValidImageType("application/pdf")).toBe(false);
  expect(isValidImageType("")).toBe(false);
});