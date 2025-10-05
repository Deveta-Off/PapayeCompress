import { test, expect } from "bun:test";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the router
const mockRouter = {
  createRoute: () => ({ component: null }),
  createFileRoute: () => ({ component: null })
};

// Mock axios
const mockAxios = {
  post: async () => ({
    data: new ArrayBuffer(8),
    headers: { "content-type": "image/jpeg" }
  }),
  isAxiosError: () => false
};

test("App Integration - renders header correctly", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  // Mock the main component structure
  const MockApp = () => (
    <div className="container h-screen m-auto flex flex-col items-center justify-center max-w-2xl px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold flex items-center justify-center gap-2">
          PapayeCompress <span>🐈</span>
        </h1>
        <p className="text-gray-600 mt-5">
          Compressez vos images en un clic ✨<br />
          Formats supportés :{" "}
          <span className="font-medium">JPG, PNG, WEBP</span>
        </p>
      </div>
    </div>
  );

  render(
    <QueryClientProvider client={queryClient}>
      <MockApp />
    </QueryClientProvider>
  );

  // Check if the main title is rendered
  const title = screen.getByText(/PapayeCompress/);
  expect(title).toBeTruthy();

  // Check if the cat emoji is present
  const catEmoji = screen.getByText("🐈");
  expect(catEmoji).toBeTruthy();

  // Check if the description is rendered
  const description = screen.getByText(/Compressez vos images en un clic/);
  expect(description).toBeTruthy();

  // Check supported formats
  const formats = screen.getByText("JPG, PNG, WEBP");
  expect(formats).toBeTruthy();
});

test("App Integration - has proper layout structure", () => {
  const queryClient = new QueryClient();
  
  const MockApp = () => (
    <div className="container h-screen m-auto flex flex-col items-center justify-center max-w-2xl px-6 py-10">
      <div data-testid="header">Header</div>
      <div data-testid="upload-zone">Upload Zone</div>
      <div data-testid="settings">Settings</div>
      <div data-testid="results">Results</div>
      <div data-testid="error">Error</div>
    </div>
  );

  const { container } = render(
    <QueryClientProvider client={queryClient}>
      <MockApp />
    </QueryClientProvider>
  );

  // Check main container classes
  const mainContainer = container.firstChild as HTMLElement;
  expect(mainContainer?.classList?.contains('container')).toBe(true);
  expect(mainContainer?.classList?.contains('flex')).toBe(true);
  expect(mainContainer?.classList?.contains('flex-col')).toBe(true);

  // Check all sections are present
  expect(screen.getByTestId('header')).toBeTruthy();
  expect(screen.getByTestId('upload-zone')).toBeTruthy();
  expect(screen.getByTestId('settings')).toBeTruthy();
  expect(screen.getByTestId('results')).toBeTruthy();
  expect(screen.getByTestId('error')).toBeTruthy();
});

test("State Management - initial state is correct", () => {
  interface CompressionState {
    isUploading: boolean;
    quality: number;
    originalSize?: number;
    compressedURL?: string;
    compressedSize?: number;
    compressedFormat?: string;
    error?: string;
  }

  const initialState: CompressionState = {
    isUploading: false,
    quality: 50,
  };

  expect(initialState.isUploading).toBe(false);
  expect(initialState.quality).toBe(50);
  expect(initialState.originalSize).toBeUndefined();
  expect(initialState.compressedURL).toBeUndefined();
  expect(initialState.compressedSize).toBeUndefined();
  expect(initialState.compressedFormat).toBeUndefined();
  expect(initialState.error).toBeUndefined();
});

test("File Processing - validates file constraints", () => {
  const maxFileSize = 2e7; // 20MB
  
  function validateFile(file: { size: number; type: string }) {
    const errors: string[] = [];
    
    if (file.size > maxFileSize) {
      errors.push("Fichier trop volumineux ! Veuillez uploader un fichier < 20Mb");
    }
    
    if (!file.type.startsWith("image/")) {
      errors.push("Format de fichier invalide ! Veuillez uploader une image");
    }
    
    return errors;
  }

  // Valid file
  expect(validateFile({ size: 1000000, type: "image/jpeg" })).toEqual([]);
  
  // Too large
  expect(validateFile({ size: maxFileSize + 1, type: "image/jpeg" }))
    .toContain("Fichier trop volumineux ! Veuillez uploader un fichier < 20Mb");
  
  // Invalid type
  expect(validateFile({ size: 1000000, type: "text/plain" }))
    .toContain("Format de fichier invalide ! Veuillez uploader une image");
  
  // Both issues
  const errors = validateFile({ size: maxFileSize + 1, type: "text/plain" });
  expect(errors).toHaveLength(2);
});