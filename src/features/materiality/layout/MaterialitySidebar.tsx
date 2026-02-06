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
} from "@mui/material";
import {
  TableChart as TableChartIcon,
  PlaylistAddCheck as ListChecksIcon,
  PieChart as PieChartIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { GCB_COLORS } from "@/config/colors.config";
import { useAuthStore } from "@/store/authStore";

const DRAWER_WIDTH = 280;

export default function MaterialitySidebar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const isDark = theme.palette.mode === "dark";

  const BRAND_GOLD = GCB_COLORS.gold.DEFAULT;

  const workflowItems = [
    {
      id: "profiling",
      label: "Profiling",
      subLabel: "Define Scope",
      icon: ListChecksIcon,
      path: "/materiality/profiling",
    },
    {
      id: "input",
      label: "Data Input",
      subLabel: "Values & Weights",
      icon: TableChartIcon,
      path: "/materiality/data-input",
    },
    {
      id: "dashboard",
      label: "Analytics",
      subLabel: "Results View",
      icon: PieChartIcon,
      path: "/materiality",
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
          bgcolor: isDark ? "#0B1120" : "#1e293b", // Always dark, luxurious sidebar
          color: "#fff",
          borderRight: "none",
          boxShadow: "4px 0 24px rgba(0,0,0,0.4)",
          backgroundImage: `linear-gradient(180deg, ${alpha("#0f172a", 0.95)} 0%, ${alpha("#1e293b", 0.98)} 100%)`,
        },
      }}
    >
      {/* --- HEADER --- */}
      <Box
        sx={{
          p: 4,
          pb: 2,
          background: `linear-gradient(90deg, ${alpha(BRAND_GOLD, 0.1)} 0%, transparent 100%)`,
          borderBottom: `1px solid ${alpha(BRAND_GOLD, 0.1)}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Box
            component="img"
            src="/assets/images/gcb_dark.png"
            alt="GCB Logo"
            sx={{ height: 32 }}
          />
        </Box>
        <Typography
          variant="overline"
          sx={{
            color: BRAND_GOLD,
            letterSpacing: "0.2em",
            fontWeight: 700,
            fontSize: "0.7rem",
            display: "block",
            mt: 1,
          }}
        >
          Materiality Assessment
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "rgba(255,255,255,0.4)", display: "block" }}
        >
          FY 2026 Strategic Cycle
        </Typography>
      </Box>

      {/* --- WORKFLOW NAVIGATION --- */}
      <Box sx={{ flexGrow: 1, py: 4, px: 2 }}>
        <Typography
          variant="caption"
          sx={{
            pl: 2,
            mb: 2,
            display: "block",
            color: alpha(BRAND_GOLD, 0.7),
            fontWeight: 700,
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          Workflow Stages
        </Typography>

        <List disablePadding>
          {workflowItems.map((item) => {
            const customMatch =
              item.id === "dashboard"
                ? location.pathname === "/materiality"
                : location.pathname.startsWith(item.path);

            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 1.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={customMatch}
                  sx={{
                    borderRadius: "12px",
                    py: 1.5,
                    px: 2,
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    bgcolor: customMatch
                      ? alpha(BRAND_GOLD, 0.15)
                      : "transparent",
                    border: `1px solid ${customMatch ? alpha(BRAND_GOLD, 0.3) : "transparent"}`,
                    "&:hover": {
                      bgcolor: alpha(BRAND_GOLD, 0.08),
                      transform: "translateX(4px)",
                    },
                    "&.Mui-selected": {
                      bgcolor: alpha(BRAND_GOLD, 0.15),
                      "&:hover": { bgcolor: alpha(BRAND_GOLD, 0.2) },
                    },
                  }}
                >
                  {/* Left Active Indicator */}
                  {customMatch && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        height: "40%",
                        width: "4px",
                        bgcolor: BRAND_GOLD,
                        borderRadius: "0 4px 4px 0",
                        boxShadow: `0 0 12px ${BRAND_GOLD}`,
                      }}
                    />
                  )}

                  <ListItemIcon
                    sx={{
                      minWidth: 42,
                      color: customMatch ? BRAND_GOLD : "rgba(255,255,255,0.4)",
                    }}
                  >
                    <item.icon sx={{ fontSize: 22 }} />
                  </ListItemIcon>

                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: customMatch ? 600 : 400,
                        color: customMatch ? "#fff" : "rgba(255,255,255,0.7)",
                        fontSize: "0.95rem",
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(255,255,255,0.3)",
                        fontSize: "0.7rem",
                        display: "block",
                        mt: -0.3,
                      }}
                    >
                      {item.subLabel}
                    </Typography>
                  </Box>

                  {customMatch && (
                    <Box sx={{ ml: "auto" }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: BRAND_GOLD,
                          boxShadow: `0 0 8px ${BRAND_GOLD}`,
                        }}
                      />
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* --- BOTTOM ACTIONS --- */}
      <Box sx={{ p: 3, background: "rgba(0,0,0,0.2)" }}>
        <Button
          fullWidth
          startIcon={<DashboardIcon />}
          onClick={() => navigate("/modules")}
          sx={{
            justifyContent: "flex-start",
            color: "rgba(255,255,255,0.6)",
            textTransform: "none",
            borderColor: "rgba(255,255,255,0.1)",
            mb: 2,
            "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.05)" },
          }}
        >
          Switch Module
        </Button>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            borderRadius: "12px",
            bgcolor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: BRAND_GOLD,
              color: "#000",
              fontSize: "0.9rem",
              fontWeight: "bold",
            }}
          >
            {user?.name?.charAt(0) || "U"}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              noWrap
              sx={{ color: "#fff", fontWeight: 500 }}
            >
              {user?.name || "User"}
            </Typography>
            <Typography
              variant="caption"
              noWrap
              sx={{ color: "rgba(255,255,255,0.4)" }}
            >
              {user?.role || "ESG Officer"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
