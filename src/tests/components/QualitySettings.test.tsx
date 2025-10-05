import { test, expect } from "bun:test";
import { render, screen } from "@testing-library/react";
import { QualitySettings } from "../../components/QualitySettings";

test("QualitySettings - renders with initial quality value", () => {
  const mockOnQualityChange = () => {};
  
  render(
    <QualitySettings 
      quality={75} 
      onQualityChange={mockOnQualityChange} 
    />
  );

  // Check if the quality value is displayed
  const qualityValue = screen.getByText("75%");
  expect(qualityValue).toBeInTheDocument();
});

test("QualitySettings - renders quality label", () => {
  const mockOnQualityChange = () => {};
  
  render(
    <QualitySettings 
      quality={50} 
      onQualityChange={mockOnQualityChange} 
    />
  );

  // Check if the quality label exists
  const label = screen.getByLabelText("Qualité");
  expect(label).toBeTruthy();
});

test("QualitySettings - renders range input with correct attributes", () => {
  const mockOnQualityChange = () => {};
  
  render(
    <QualitySettings 
      quality={30} 
      onQualityChange={mockOnQualityChange} 
    />
  );

  const rangeInput = screen.getByRole("slider");
  expect(rangeInput).toBeTruthy();
  expect(rangeInput.getAttribute("min")).toBe("1");
  expect(rangeInput.getAttribute("max")).toBe("100");
  expect(rangeInput.getAttribute("value")).toBe("30");
});

test("QualitySettings - renders settings title", () => {
  const mockOnQualityChange = () => {};
  
  render(
    <QualitySettings 
      quality={50} 
      onQualityChange={mockOnQualityChange} 
    />
  );

  const title = screen.getByText(/Paramètres/);
  expect(title).toBeTruthy();
});

test("QualitySettings - handles edge case values", () => {
  const mockOnQualityChange = () => {};
  
  // Test minimum value
  render(
    <QualitySettings 
      quality={1} 
      onQualityChange={mockOnQualityChange} 
    />
  );
  expect(screen.getByText("1%")).toBeTruthy();

  // Test maximum value  
  const { rerender } = render(
    <QualitySettings 
      quality={100} 
      onQualityChange={mockOnQualityChange} 
    />
  );
  expect(screen.getByText("100%")).toBeTruthy();
});