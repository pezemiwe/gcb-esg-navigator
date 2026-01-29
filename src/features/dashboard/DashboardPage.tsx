import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import DashboardNavbar from "@/components/layout/DashboardNavbar/DashboardNavbar";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user } = useAuthStore();
  if (!user) return null;
  return (
    <Box
      sx={{ minHeight: "100vh", background: isDark ? "#0F172A" : "#F8FAFC" }}
    >
      <DashboardNavbar />
      <Box sx={{ maxWidth: 1280, mx: "auto", px: 3, py: 5 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          mb={2}
          sx={{ color: isDark ? "#fff" : "#0F172A" }}
        >
          Hi, {user.name}
        </Typography>
      </Box>
    </Box>
  );
}
