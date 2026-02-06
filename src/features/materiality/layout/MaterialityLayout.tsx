import { Box, useTheme } from "@mui/material";
import MaterialitySidebar from "./MaterialitySidebar";

interface MaterialityLayoutProps {
  children: React.ReactNode;
}

const DRAWER_WIDTH = 280;

export default function MaterialityLayout({
  children,
}: MaterialityLayoutProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const bgColor = isDark ? "#0B1121" : "#F8FAFC";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: bgColor }}>
      <MaterialitySidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          minHeight: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
