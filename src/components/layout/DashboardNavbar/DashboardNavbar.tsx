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
// import { usePermissions } from "@/hooks/usePermissions";
// import { Permission } from "@/config/permissions.config";
import LogoutIcon from "@mui/icons-material/Logout";
import { Upload } from "lucide-react";

export default function DashboardNavbar() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user, logout } = useAuthStore();
  //   const { permissions } = usePermissions();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modulesAnchorEl, setModulesAnchorEl] = useState<null | HTMLElement>(
    null,
  );

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
  // Handlers for modules menu
  const handleModulesMenu = (event: React.MouseEvent<HTMLElement>) => {
    setModulesAnchorEl(event.currentTarget);
  };
  const handleModulesClose = () => {
    setModulesAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        // Toned down gradient - more subtle
        background: isDark
          ? `linear-gradient(90deg, #1E293B 0%, #0F172A 100%)`
          : `linear-gradient(90deg, #E5A50F 0%, #D97706 100%)`, // Less bright yellow
        color: isDark ? "#fff" : "#0F172A",
        borderBottom: isDark
          ? `1px solid ${alpha("#FDB913", 0.1)}`
          : `1px solid ${alpha("#D97706", 0.2)}`, // Subtle border
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
          {/* Modules dropdown menu */}
          <Button
            color="inherit"
            onClick={handleModulesMenu}
            sx={{ fontWeight: 600 }}
          >
            Modules
          </Button>
          <Menu
            anchorEl={modulesAnchorEl}
            open={Boolean(modulesAnchorEl)}
            onClose={handleModulesClose}
          >
            <MenuItem
              onClick={handleModulesClose}
              component="a"
              href="/cra/data"
            >
              CRA Data Upload <Upload size={16} style={{ marginLeft: 8 }} />
            </MenuItem>
          </Menu>
          {/* Example nav links based on permissions */}
          {/* {permissions.includes(Permission.VIEW_DASHBOARD) && (
            <Button color="inherit" href="/dashboard" sx={{ fontWeight: 600 }}>
              Dashboard
            </Button>
          )}
          {permissions.includes(Permission.MANAGE_USERS) && (
            <Button color="inherit" href="#" sx={{ fontWeight: 600 }}>
              Users
            </Button>
          )} */}
          <IconButton onClick={handleMenu} sx={{ ml: 1 }}>
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{
                bgcolor: isDark
                  ? alpha("#FDB913", 0.2)
                  : alpha("#D97706", 0.15),
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
