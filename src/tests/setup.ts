// Global test setup for Bun tests
import { beforeAll, afterEach } from "bun:test";
import { GlobalWindow } from "happy-dom";

// Setup DOM environment using happy-dom
beforeAll(() => {
  const window = new GlobalWindow();
  global.window = window as any;
  global.document = window.document as any;
  global.navigator = window.navigator as any;
  global.HTMLElement = window.HTMLElement as any;
  global.Element = window.Element as any;
  global.Node = window.Node as any;
});

// Cleanup after each test
afterEach(() => {
  // Clean up DOM
  if (global.document?.body) {
    global.document.body.innerHTML = '';
  }
});

// Mock commonly used browser APIs
global.URL = global.URL || {
  createObjectURL: (_blob: any) => `blob:mock-url-${Date.now()}`,
  revokeObjectURL: () => {}
};

global.Blob = global.Blob || class MockBlob {
  size: number;
  type: string;
  
  constructor(parts: any[], options: { type?: string } = {}) {
    this.size = parts.join('').length;
    this.type = options.type || '';
  }
};

// Mock TextDecoder
global.TextDecoder = global.TextDecoder || class MockTextDecoder {
  decode(_input: any): string {
    return JSON.stringify({ error: "Mock error" });
  }
};

// Mock FormData
global.FormData = global.FormData || class MockFormData {
  private data: Map<string, any> = new Map();
  
  append(key: string, value: any) {
    this.data.set(key, value);
  }
  
  get(key: string) {
    return this.data.get(key);
  }
};

// Basic DOM assertions helper functions
(global as any).expectElementToExist = (element: Element | null) => {
  if (!element) {
    throw new Error('Expected element to exist in document');
  }
  return element;
};

(global as any).expectElementToHaveClass = (element: Element | null, className: string) => {
  if (!element?.classList?.contains(className)) {
    throw new Error(`Expected element to have class "${className}"`);
  }
  return element;
};