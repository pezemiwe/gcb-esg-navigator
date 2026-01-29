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
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
// import { usePermissions } from "@/hooks/usePermissions";
// import { Permission } from "@/config/permissions.config";
import LogoutIcon from "@mui/icons-material/Logout";
import { Upload } from "lucide-react";

export default function DashboardNavbar() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
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
        background: isDark
          ? `linear-gradient(90deg, ${alpha("#1E293B", 0.3)} 0%, ${alpha("#0F172A", 0.3)} 100%)`
          : `linear-gradient(90deg, ${alpha("#FDB913", 0.08)} 0%, ${alpha("#E5A50F", 0.06)} 100%)`,
        color: isDark ? "#fff" : "#0F172A",
        borderBottom: isDark
          ? `1px solid ${alpha("#FDB913", 0.08)}`
          : `1px solid ${alpha("#E5A50F", 0.12)}`,
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
          {/* Dashboard/Overview link */}
          <Button
            color="inherit"
            onClick={() => navigate("/dashboard")}
            sx={{ fontWeight: 600 }}
          >
            Overview
          </Button>

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
              onClick={() => {
                handleModulesClose();
                navigate("/cra/data");
              }}
            >
              CRA Data
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleModulesClose();
                navigate("/cra/segmentation");
              }}
            >
              Portfolio Segmentation
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleModulesClose();
                navigate("/cra/pra");
              }}
            >
              Physical Risk Mapping
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleModulesClose();
                navigate("/cra/tra");
              }}
            >
              Transition Risk Analytics
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleModulesClose();
                navigate("/cra/collateral");
              }}
            >
              Collateral Sensitivity
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleModulesClose();
                navigate("/cra/reporting");
              }}
            >
              CRA Reporting
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
