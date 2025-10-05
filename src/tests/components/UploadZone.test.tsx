import { test, expect } from "bun:test";
import { render, screen } from "@testing-library/react";
import { UploadZone } from "../../components/UploadZone";

test("UploadZone - renders upload text when not uploading", () => {
  const mockOnFileChange = () => {};
  const mockFileInputRef = { current: null };
  
  render(
    <UploadZone 
      isUploading={false}
      onFileChange={mockOnFileChange}
      fileInputRef={mockFileInputRef}
    />
  );

  const uploadText = screen.getByText("Cliquez ou déposez une image ici");
  expect(uploadText).toBeTruthy();
});

test("UploadZone - renders file input with correct attributes", () => {
  const mockOnFileChange = () => {};
  const mockFileInputRef = { current: null };
  
  render(
    <UploadZone 
      isUploading={false}
      onFileChange={mockOnFileChange}
      fileInputRef={mockFileInputRef}
    />
  );

  const fileInput = screen.getByLabelText("Cliquez ou déposez une image ici");
  expect(fileInput).toBeTruthy();
  expect(fileInput.getAttribute("type")).toBe("file");
  expect(fileInput.getAttribute("accept")).toBe("image/*");
});

test("UploadZone - shows loading state when uploading", () => {
  const mockOnFileChange = () => {};
  const mockFileInputRef = { current: null };
  
  render(
    <UploadZone 
      isUploading={true}
      onFileChange={mockOnFileChange}
      fileInputRef={mockFileInputRef}
    />
  );

  const loadingText = screen.getByText("Traitement en cours...");
  expect(loadingText).toBeTruthy();
});

test("UploadZone - applies correct CSS classes", () => {
  const mockOnFileChange = () => {};
  const mockFileInputRef = { current: null };
  
  const { container } = render(
    <UploadZone 
      isUploading={false}
      onFileChange={mockOnFileChange}
      fileInputRef={mockFileInputRef}
    />
  );

  const label = container.querySelector('label');
  expect(label?.classList.contains('border-dashed')).toBe(true);
  expect(label?.classList.contains('rounded-2xl')).toBe(true);
});