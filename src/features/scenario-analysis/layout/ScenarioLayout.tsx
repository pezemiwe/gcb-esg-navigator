import { Box, useTheme } from "@mui/material";
import ScenarioSidebar from "./ScenarioSidebar";

interface ScenarioLayoutProps {
  children: React.ReactNode;
}

const DRAWER_WIDTH = 260;

export default function ScenarioLayout({ children }: ScenarioLayoutProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const bgColor = isDark ? "#0B1121" : "#F8FAFC";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: bgColor }}>
      <ScenarioSidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Box sx={{ p: 4, flex: 1, maxWidth: 1600, mx: "auto", width: "100%" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
