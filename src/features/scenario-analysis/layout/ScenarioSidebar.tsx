import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  alpha,
  Avatar,
  Button,
} from "@mui/material";
import {
  LayoutDashboard,
  PlayCircle,
  Library,
  Settings2,
  FileBarChart,
  ChevronLeft,
  Calculator,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { GCB_COLORS } from "@/config/colors.config";
import { useAuthStore } from "@/store/authStore";
const DRAWER_WIDTH = 260;
export default function ScenarioSidebar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const isDark = theme.palette.mode === "dark";
  const menuItems = [
    {
      id: "dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      path: "/scenario-analysis",
    },
    {
      id: "run",
      label: "Run Simulation",
      icon: PlayCircle,
      path: "/scenario-analysis/run",
    },
    {
      id: "quant",
      label: "Quant Analysis",
      icon: Calculator,
      path: "/scenario-analysis/quant",
    },
    {
      id: "library",
      label: "Scenario Library",
      icon: Library,
      path: "/scenario-analysis/library",
    },
    {
      id: "assumptions",
      label: "Assumptions",
      icon: Settings2,
      path: "/scenario-analysis/assumptions",
    },
    {
      id: "reports",
      label: "Stress Test Reports",
      icon: FileBarChart,
      path: "/scenario-analysis/reports",
    },
  ];
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
          borderRight: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
        },
      }}
    >
      {}
      <Box
        sx={{
          height: 80,
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          component="img"
          src="/assets/images/gcb_dark.png"
          alt="GCB Bank"
          sx={{ height: 32, width: "auto" }}
        />
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
              color: isDark ? "#FFF" : GCB_COLORS.slate.dark,
            }}
          >
            Scenario Lab
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: GCB_COLORS.gold.DEFAULT,
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Stress Testing
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mx: 3, mb: 2 }} />
      {}
      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: "8px",
                  minHeight: 44,
                  backgroundColor: isActive
                    ? alpha(GCB_COLORS.gold.DEFAULT, 0.15)
                    : "transparent",
                  color: isActive
                    ? GCB_COLORS.gold.dark
                    : theme.palette.text.secondary,
                  "&:hover": {
                    backgroundColor: alpha(GCB_COLORS.gold.DEFAULT, 0.05),
                    color: isActive
                      ? GCB_COLORS.gold.dark
                      : theme.palette.text.primary,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: "inherit",
                  }}
                >
                  <Icon size={18} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      {}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ChevronLeft size={16} />}
          onClick={() => navigate("/modules")}
          sx={{
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary,
            justifyContent: "flex-start",
            textTransform: "none",
            mb: 2,
            "&:hover": {
              borderColor: GCB_COLORS.gold.DEFAULT,
              color: GCB_COLORS.gold.DEFAULT,
              backgroundColor: alpha(GCB_COLORS.gold.DEFAULT, 0.05),
            },
          }}
        >
          Switch Modules
        </Button>
        <Box
          sx={{
            p: 2,
            borderRadius: "12px",
            backgroundColor: isDark
              ? alpha("#1E293B", 0.5)
              : alpha("#F1F5F9", 0.8),
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{ width: 32, height: 32, fontSize: "0.875rem" }}
            src={user?.avatar}
          >
            {user?.name.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {user?.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              noWrap
            >
              {user?.role}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
