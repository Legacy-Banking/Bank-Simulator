import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from '@/components/ui/button';

describe("Button Component", () => {
  test("renders with default styles", () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole("button", { name: /default button/i });
    expect(button).toHaveClass("bg-primary text-primary-foreground hover:bg-primary/90");
  });

  test("applies variant styles correctly", () => {
    const { rerender } = render(<Button variant="destructive">Destructive</Button>);
    let button = screen.getByRole("button", { name: /destructive/i });
    expect(button).toHaveClass("bg-destructive text-destructive-foreground hover:bg-destructive/90");

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole("button", { name: /outline/i });
    expect(button).toHaveClass("border border-input bg-background hover:bg-accent hover:text-accent-foreground");
  });

  test("applies size styles correctly", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole("button", { name: /small/i });
    expect(button).toHaveClass("h-9 rounded-md px-3");

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole("button", { name: /large/i });
    expect(button).toHaveClass("h-11 rounded-md px-8");
  });

  test("renders as a child component with 'asChild' prop", () => {
    render(
      <Button asChild>
        <a href="/link">Link Button</a>
      </Button>
    );
    const linkButton = screen.getByRole("link", { name: /link button/i });
    expect(linkButton).toHaveAttribute("href", "/link");
  });

  test("handles disabled state", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole("button", { name: /disabled button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:pointer-events-none disabled:opacity-50");
  });

  test("fires click event", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);
    const button = screen.getByRole("button", { name: /clickable button/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
