import { type ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useThemeStore } from "@/store/themeStore";
import { lightTheme, darkTheme } from "@/config/theme.config";

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  const { mode } = useThemeStore();
  const theme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
