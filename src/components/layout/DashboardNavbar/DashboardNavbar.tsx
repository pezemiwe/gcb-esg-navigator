import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Button,
  alpha,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/config/permissions.config";
import LogoutIcon from "@mui/icons-material/Logout";

export default function DashboardNavbar() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user, logout } = useAuthStore();
  const { permissions } = usePermissions();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!user) return null;

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: isDark
          ? `linear-gradient(90deg, #1E293B 0%, #0F172A 100%)`
          : `linear-gradient(90deg, #FDB913 0%, #F59E0B 100%)`,
        color: isDark ? "#fff" : "#0F172A",
        borderBottom: isDark
          ? `1px solid ${alpha("#FDB913", 0.1)}`
          : `1px solid #F1F5F9`,
        zIndex: 1201,
      }}
    >
      <Toolbar
        sx={{ minHeight: 64, display: "flex", justifyContent: "space-between" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            component="img"
            src="/assets/images/gcb_dark.png"
            alt="GCB Bank"
            sx={{ height: 36, width: "auto" }}
          />
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, letterSpacing: 1, ml: 1 }}
          >
            ESG Navigator
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Example nav links based on permissions */}
          {permissions.includes(Permission.VIEW_DASHBOARD) && (
            <Button color="inherit" href="/dashboard" sx={{ fontWeight: 600 }}>
              Dashboard
            </Button>
          )}
          {permissions.includes(Permission.VIEW_CRA_DATA) && (
            <Button color="inherit" href="#" sx={{ fontWeight: 600 }}>
              CRA Data
            </Button>
          )}
          {permissions.includes(Permission.MANAGE_USERS) && (
            <Button color="inherit" href="#" sx={{ fontWeight: 600 }}>
              Users
            </Button>
          )}
          <IconButton onClick={handleMenu} sx={{ ml: 1 }}>
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{
                bgcolor: isDark ? alpha("#FDB913", 0.2) : "#FDB913",
                color: isDark ? "#fff" : "#0F172A",
              }}
            >
              {user.name[0]}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled>
              <Box>
                <Typography fontWeight={700}>{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.role.replace("_", " ").toUpperCase()}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
