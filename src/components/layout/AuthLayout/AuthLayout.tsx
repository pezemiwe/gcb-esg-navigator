import { Box, Container, useTheme, alpha } from "@mui/material";
import { type ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="video"
        autoPlay
        loop
        muted
        playsInline
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: isDark ? 0.15 : 0.2,
          zIndex: 0,
          filter: isDark ? "brightness(50%)" : "brightness(110%)",
        }}
      >
        <source
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          type="video/mp4"
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: isDark ? alpha("#0F172A", 0.8) : alpha("#FFFFFF", 0.9),
          zIndex: 1,
        }}
      />

      <Container
        maxWidth="sm"
        sx={{
          position: "relative",
          zIndex: 2,
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
