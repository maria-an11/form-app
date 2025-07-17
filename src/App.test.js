import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

describe("Form component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(window, "alert").mockImplementation(() => {}); // ✅ mock alert
  });

  it("renders the form and toggles dark mode", () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/First name/i)).toBeInTheDocument();

    const toggleButton = screen.getByRole("button", {
      name: /dark mode|light mode/i,
    });
    fireEvent.click(toggleButton);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("validates required fields", async () => {
    render(<App />);
    fireEvent.click(screen.getByText("Submit"));

    const errors = await screen.findAllByText("Required");
    expect(errors.length).toBeGreaterThan(0);
  });

  it("fills and submits the form correctly", async () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/First name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Last name/i), {
      target: { value: "Brown" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Age/i), {
      target: { value: "45" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Address/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Place of work/i), {
      target: { value: "Google" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Job title/i), {
      target: { value: "Software Engineer" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Phone number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText(/LinkedIn/i), {
      target: { value: "https://linkedin.com/in/john" },
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("John"))
    );
  });
});
