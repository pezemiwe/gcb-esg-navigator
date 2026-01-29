import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha,
} from "@mui/material";
import DashboardNavbar from "@/components/layout/DashboardNavbar/DashboardNavbar";
import { useAuthStore } from "@/store/authStore";
import { Permission } from "@/config/permissions.config";
import { PermissionGuard } from "@/guards/PermissionGuard";

export default function DashboardPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isDark ? "#0F172A" : "#F8FAFC",
      }}
    >
      <DashboardNavbar />

      <Box sx={{ maxWidth: 1280, mx: "auto", px: 3, py: 5 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          mb={2}
          sx={{ color: isDark ? "#fff" : "#0F172A" }}
        >
          Welcome, {user.name}
        </Typography>

        <Typography
          variant="subtitle1"
          mb={4}
          sx={{ color: isDark ? alpha("#FDB913", 0.8) : "#FDB913" }}
        >
          Role: {user.role.replace("_", " ").toUpperCase()}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <PermissionGuard permission={Permission.VIEW_DASHBOARD}>
              <Card
                sx={{
                  background: isDark ? alpha("#FDB913", 0.08) : "#fff",
                  boxShadow: 2,
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    ESG Score
                  </Typography>
                  <Typography variant="h3" fontWeight={700} color="primary">
                    82.5
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last updated: Today
                  </Typography>
                </CardContent>
              </Card>
            </PermissionGuard>
          </Grid>

          <Grid item xs={12} md={4}>
            <PermissionGuard permission={Permission.VIEW_CRA_DATA}>
              <Card
                sx={{
                  background: isDark ? alpha("#FDB913", 0.08) : "#fff",
                  boxShadow: 2,
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    CRA Data Entries
                  </Typography>
                  <Typography variant="h3" fontWeight={700} color="primary">
                    1,245
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This month
                  </Typography>
                </CardContent>
              </Card>
            </PermissionGuard>
          </Grid>

          <Grid item xs={12} md={4}>
            <PermissionGuard permission={Permission.GENERATE_REPORTS}>
              <Card
                sx={{
                  background: isDark ? alpha("#FDB913", 0.08) : "#fff",
                  boxShadow: 2,
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Reports Generated
                  </Typography>
                  <Typography variant="h3" fontWeight={700} color="primary">
                    37
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This year
                  </Typography>
                </CardContent>
              </Card>
            </PermissionGuard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
