import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
  useTheme,
  alpha,
  Avatar,
  Button,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  TrackChanges as TrackChangesIcon,
  Public as PublicIcon,
  Assessment as AssessmentIcon,
  ArrowBack,
} from "@mui/icons-material";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { GCB_COLORS } from "@/config/colors.config";
import { useAuthStore } from "@/store/authStore";
import { ThemeToggle } from "@/components/ui/ThemeToggle/ThemeToggle";

const DRAWER_WIDTH = 280;

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    subLabel: "Overview & KPIs",
    icon: DashboardIcon,
    path: "/sdg-ndc",
  },
  {
    id: "sdg-alignment",
    label: "SDG Alignment",
    subLabel: "17 Goals Mapping",
    icon: PublicIcon,
    path: "/sdg-ndc/sdg-alignment",
  },
  {
    id: "ndc-tracker",
    label: "NDC Tracker",
    subLabel: "Ghana's Commitments",
    icon: TrackChangesIcon,
    path: "/sdg-ndc/ndc-tracker",
  },
  {
    id: "reports",
    label: "Reports & Disclosure",
    subLabel: "Regulatory Filings",
    icon: AssessmentIcon,
    path: "/sdg-ndc/reports",
  },
];

export default function SDGLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const isDark = theme.palette.mode === "dark";
  const BRAND_GOLD = GCB_COLORS.gold.DEFAULT;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: isDark ? "#0B1120" : "#FAFBFC",
            borderRight: `1px solid ${isDark ? alpha("#fff", 0.06) : alpha("#000", 0.08)}`,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Logo + Module Title */}
        <Box sx={{ p: 2.5, pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
            }}
            onClick={() => navigate("/modules")}
          >
            <Box
              component="img"
              src="/assets/images/gcb_dark.png"
              alt="GCB Bank"
              sx={{ height: 32, width: "auto" }}
            />
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                bgcolor: isDark ? alpha("#fff", 0.15) : alpha("#000", 0.15),
                height: 24,
              }}
            />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: isDark ? alpha("#fff", 0.5) : alpha("#000", 0.4),
                  fontSize: "0.6rem",
                  textTransform: "uppercase",
                }}
              >
                ESG Navigator
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: BRAND_GOLD,
                  lineHeight: 1.2,
                  fontSize: "0.8rem",
                }}
              >
                SDG & NDC Alignment
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mx: 2, my: 1, opacity: 0.5 }} />

        {/* Navigation */}
        <List sx={{ px: 1.5, flex: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 1.5,
                    py: 1.5,
                    px: 2,
                    bgcolor: isActive
                      ? alpha(BRAND_GOLD, isDark ? 0.15 : 0.1)
                      : "transparent",
                    borderLeft: isActive
                      ? `3px solid ${BRAND_GOLD}`
                      : "3px solid transparent",
                    "&:hover": {
                      bgcolor: isActive
                        ? alpha(BRAND_GOLD, isDark ? 0.2 : 0.15)
                        : alpha(BRAND_GOLD, 0.05),
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon
                      sx={{
                        color: isActive
                          ? BRAND_GOLD
                          : isDark
                            ? alpha("#fff", 0.4)
                            : alpha("#000", 0.4),
                        fontSize: 20,
                      }}
                    />
                  </ListItemIcon>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isActive ? 700 : 500,
                        color: isActive
                          ? BRAND_GOLD
                          : isDark
                            ? alpha("#fff", 0.8)
                            : "text.primary",
                        lineHeight: 1.3,
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: isDark
                          ? alpha("#fff", 0.35)
                          : alpha("#000", 0.4),
                        fontSize: "0.65rem",
                      }}
                    >
                      {item.subLabel}
                    </Typography>
                  </Box>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* User + Back */}
        <Box sx={{ p: 2 }}>
          <ThemeToggle />
          <Divider sx={{ my: 1.5, opacity: 0.3 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: BRAND_GOLD,
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              {user?.name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("") || "U"}
            </Avatar>
            <Box>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ fontSize: "0.8rem" }}
              >
                {user?.name || "User"}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.65rem" }}
              >
                {user?.role || "Analyst"}
              </Typography>
            </Box>
          </Box>
          <Button
            size="small"
            startIcon={<ArrowBack sx={{ fontSize: 14 }} />}
            onClick={() => navigate("/modules")}
            sx={{
              mt: 0.5,
              color: isDark ? alpha("#fff", 0.5) : alpha("#000", 0.5),
              textTransform: "none",
              fontSize: "0.75rem",
              "&:hover": { color: BRAND_GOLD },
            }}
          >
            Back to Modules
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: isDark ? "#0F172A" : "#F8FAFC",
          minHeight: "100vh",
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
