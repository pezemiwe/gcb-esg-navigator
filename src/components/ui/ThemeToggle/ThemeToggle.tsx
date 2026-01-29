import { useState, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";

export function ThemeToggle() {
  const getInitialTheme = () => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  };

  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prevTheme) => !prevTheme);
  };

  return (
    <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        aria-label="Toggle theme"
        sx={{
          color: "text.primary",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        {isDark ? (
          <LightMode sx={{ fontSize: 24 }} />
        ) : (
          <DarkMode sx={{ fontSize: 24 }} />
        )}
      </IconButton>
    </Tooltip>
  );
}
