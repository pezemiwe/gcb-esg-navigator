import { createTheme } from "@mui/material/styles";
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#f4b740",
      light: "#f7c766",
      dark: "#e5a82e",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#4a5f6f",
      light: "#5d7485",
      dark: "#3d4f5d",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#f9fafb",
    },
    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
    h2: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        },
      },
    },
  },
});
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#f4b740",
      light: "#f7c766",
      dark: "#e5a82e",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#4a5f6f",
      light: "#5d7485",
      dark: "#3d4f5d",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0F172A", 
      paper: "#1E293B", 
    },
    text: {
      primary: "#f9fafb",
      secondary: "#d1d5db",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});