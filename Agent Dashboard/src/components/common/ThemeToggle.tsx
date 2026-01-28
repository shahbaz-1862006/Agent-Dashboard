import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../app/theme/ThemeProvider";
import { Button } from "../ui/Button";

export function ThemeToggle({ size = "sm" }: { size?: "sm" | "md" }) {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <Button
      type="button"
      variant="ghost"
      size={size === "sm" ? "sm" : "md"}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={theme === "dark" ? "Switch to light" : "Switch to dark"}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
