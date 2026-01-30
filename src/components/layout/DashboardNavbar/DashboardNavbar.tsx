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
  Divider,
  Chip,
  Badge,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import UploadIcon from "@mui/icons-material/Upload";
import AssessmentIcon from "@mui/icons-material/Assessment";

export default function DashboardNavbar() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modulesAnchorEl, setModulesAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [notificationsAnchorEl, setNotificationsAnchorEl] =
    useState<null | HTMLElement>(null);

  if (!user) return null;

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModulesMenu = (event: React.MouseEvent<HTMLElement>) => {
    setModulesAnchorEl(event.currentTarget);
  };

  const handleModulesClose = () => {
    setModulesAnchorEl(null);
  };

  const handleNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  // Your original color scheme
  const primaryColor = "#FDB913"; // Gold/Yellow
  const darkBg = "#0F172A"; // Dark blue
  const lightBg = "#F8FAFC"; // Light background
  const textDark = "#0F172A";
  const textLight = "#FFFFFF";

  // Dynamic colors based on theme
  const backgroundColor = isDark
    ? `linear-gradient(90deg, ${alpha("#1E293B", 0.3)} 0%, ${alpha("#0F172A", 0.3)} 100%)`
    : `linear-gradient(90deg, ${alpha("#FDB913", 0.08)} 0%, ${alpha("#E5A50F", 0.06)} 100%)`;

  const borderColor = isDark
    ? `1px solid ${alpha("#FDB913", 0.08)}`
    : `1px solid ${alpha("#E5A50F", 0.12)}`;

  const textColor = isDark ? textLight : textDark;

  return (
    <AppBar
      position="fixed"
      elevation={isDark ? 1 : 2}
      sx={{
        background: backgroundColor,
        color: textColor,
        borderBottom: `2px solid ${isDark ? alpha(primaryColor, 0.3) : alpha(primaryColor, 0.4)}`,
        zIndex: theme.zIndex.drawer + 1,
        height: 70,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <Toolbar sx={{ minHeight: 70, px: 3 }}>
        {/* Left Section - Logo and Title */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 3, flexGrow: 1 }}
        >
          {/* Your Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              component="img"
              src={
                isDark
                  ? "/assets/images/gcb_dark.png"
                  : "/assets/images/gcb_dark.png"
              }
              alt="GCB Bank"
              sx={{ height: 40, width: "auto" }}
            />
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                bgcolor: isDark ? alpha("#fff", 0.2) : alpha(textDark, 0.2),
                height: 40,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.25rem",
                letterSpacing: 0.5,
                background: isDark
                  ? "linear-gradient(90deg, #FFFFFF 0%, #F0F0F0 100%)"
                  : "linear-gradient(90deg, #0F172A 0%, #334155 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ESG Navigator
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 4 }}>
            <Button
              color="inherit"
              onClick={() => navigate("/dashboard")}
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                textTransform: "none",
                borderRadius: 1,
                px: 2,
                py: 1,
                "&:hover": {
                  backgroundColor: isDark
                    ? alpha("#fff", 0.1)
                    : alpha(textDark, 0.05),
                },
              }}
            >
              Overview
            </Button>

            <Button
              color="inherit"
              onClick={handleModulesMenu}
              endIcon={<ArrowDropDownIcon />}
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                textTransform: "none",
                borderRadius: 1,
                px: 2,
                py: 1,
                "&:hover": {
                  backgroundColor: isDark
                    ? alpha("#fff", 0.1)
                    : alpha(textDark, 0.05),
                },
              }}
            >
              Modules
            </Button>

            <Button
              color="inherit"
              onClick={() => navigate("/reports")}
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                textTransform: "none",
                borderRadius: 1,
                px: 2,
                py: 1,
                "&:hover": {
                  backgroundColor: isDark
                    ? alpha("#fff", 0.1)
                    : alpha(textDark, 0.05),
                },
              }}
            >
              Reports
            </Button>

            <Button
              color="inherit"
              onClick={() => navigate("/analytics")}
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                textTransform: "none",
                borderRadius: 1,
                px: 2,
                py: 1,
                "&:hover": {
                  backgroundColor: isDark
                    ? alpha("#fff", 0.1)
                    : alpha(textDark, 0.05),
                },
              }}
            >
              Analytics
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<UploadIcon />}
            onClick={() => navigate("/cra/data")}
            sx={{
              color: textColor,
              borderColor: isDark ? alpha("#fff", 0.3) : alpha(textDark, 0.3),
              textTransform: "none",
              fontSize: "0.75rem",
              fontWeight: 500,
              borderRadius: "6px",
              px: 1.5,
              height: "40px",
              "&:hover": {
                borderColor: primaryColor,
                backgroundColor: alpha(primaryColor, 0.1),
              },
            }}
          >
            Upload Data
          </Button>

          {/* Notifications */}
          <IconButton
            size="small"
            onClick={handleNotifications}
            sx={{
              color: textColor,
              "&:hover": {
                backgroundColor: isDark
                  ? alpha("#fff", 0.1)
                  : alpha(textDark, 0.05),
              },
            }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon fontSize="medium" />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}>
            <IconButton onClick={handleMenu} sx={{ p: 0.5 }}>
              <Avatar
                src={user.avatar}
                alt={user.name}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: isDark
                    ? alpha(primaryColor, 0.3)
                    : alpha(primaryColor, 0.2),
                  color: isDark ? textLight : textDark,
                  border: `2px solid ${isDark ? alpha(primaryColor, 0.4) : alpha(primaryColor, 0.3)}`,
                  fontWeight: 600,
                }}
              >
                {user.name?.[0]?.toUpperCase() || <PersonIcon />}
              </Avatar>
            </IconButton>
          </Box>
        </Box>

        {/* Modules Menu */}
        <Menu
          anchorEl={modulesAnchorEl}
          open={Boolean(modulesAnchorEl)}
          onClose={handleModulesClose}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1.5,
              minWidth: 300,
              borderRadius: 2,
              border: `1px solid ${borderColor}`,
              backgroundColor: isDark ? darkBg : lightBg,
            },
          }}
        >
          <MenuItem
            sx={{
              py: 1.5,
              px: 2,
              fontWeight: 700,
              color: isDark ? primaryColor : textDark,
              backgroundColor: isDark
                ? alpha(primaryColor, 0.1)
                : alpha(primaryColor, 0.05),
            }}
          >
            <AssessmentIcon sx={{ mr: 2, color: primaryColor }} />
            Climate Risk Assessment
          </MenuItem>
          <Divider sx={{ borderColor: borderColor }} />
          {/* <MenuItem
            onClick={() => {
              handleModulesClose();
              navigate("/cra");
            }}
            sx={{ py: 1.5, px: 2 }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                color={isDark ? textLight : textDark}
              >
                Climate Risk Dashboard
              </Typography>
              <Typography
                variant="caption"
                color={isDark ? "text.secondary" : "text.disabled"}
              >
                Overview and key metrics
              </Typography>
            </Box>
          </MenuItem> */}
          <MenuItem
            onClick={() => {
              handleModulesClose();
              navigate("/cra/data");
            }}
            sx={{ py: 1.5, px: 2 }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                color={isDark ? textLight : textDark}
              >
                CRA Data Setup
              </Typography>
              <Typography
                variant="caption"
                color={isDark ? "text.secondary" : "text.disabled"}
              >
                Upload and manage portfolio data
              </Typography>
            </Box>
            <UploadIcon fontSize="small" color="action" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleModulesClose();
              navigate("/cra/segmentation");
            }}
            sx={{ py: 1.5, px: 2 }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                color={isDark ? textLight : textDark}
              >
                Portfolio Segmentation
              </Typography>
              <Typography
                variant="caption"
                color={isDark ? "text.secondary" : "text.disabled"}
              >
                Sector and geographic analysis
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleModulesClose();
              navigate("/cra/pra");
            }}
            sx={{ py: 1.5, px: 2 }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                color={isDark ? textLight : textDark}
              >
                Physical Risk Assessment
              </Typography>
              <Typography
                variant="caption"
                color={isDark ? "text.secondary" : "text.disabled"}
              >
                Acute and chronic climate hazards
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleModulesClose();
              navigate("/cra/tra");
            }}
            sx={{ py: 1.5, px: 2 }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                color={isDark ? textLight : textDark}
              >
                Transition Risk Assessment
              </Typography>
              <Typography
                variant="caption"
                color={isDark ? "text.secondary" : "text.disabled"}
              >
                Policy, technology, and market risks
              </Typography>
            </Box>
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchorEl}
          open={Boolean(notificationsAnchorEl)}
          onClose={handleNotificationsClose}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1,
              minWidth: 320,
              maxHeight: 400,
              borderRadius: 2,
              border: `1px solid ${borderColor}`,
              backgroundColor: isDark ? darkBg : lightBg,
            },
          }}
        >
          <MenuItem
            disabled
            sx={{
              py: 1.5,
              px: 2,
              fontWeight: 600,
              color: isDark ? textLight : textDark,
            }}
          >
            <NotificationsIcon sx={{ mr: 2, color: primaryColor }} />
            Notifications
          </MenuItem>
          <Divider sx={{ borderColor: borderColor }} />
          <MenuItem sx={{ py: 1.5, px: 2 }}>
            <Box>
              <Typography
                variant="body2"
                fontWeight={600}
                color={isDark ? textLight : textDark}
              >
                New Data Available
              </Typography>
              <Typography
                variant="caption"
                color={isDark ? "text.secondary" : "text.disabled"}
              >
                Climate risk dataset has been updated
              </Typography>
              <Typography
                variant="caption"
                display="block"
                color={isDark ? "text.secondary" : "text.disabled"}
              >
                2 hours ago
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem sx={{ py: 1.5, px: 2 }}>
            <Box>
              <Typography
                variant="body2"
                fontWeight={600}
                color={isDark ? textLight : textDark}
              >
                Report Generated
              </Typography>
              <Typography
                variant="caption"
                color={isDark ? "text.secondary" : "text.disabled"}
              >
                Q3 ESG Compliance Report is ready
              </Typography>
              <Typography
                variant="caption"
                display="block"
                color={isDark ? "text.secondary" : "text.disabled"}
              >
                1 day ago
              </Typography>
            </Box>
          </MenuItem>
        </Menu>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1,
              minWidth: 300,
              borderRadius: 2,
              border: `1px solid ${borderColor}`,
              backgroundColor: isDark ? darkBg : lightBg,
            },
          }}
        >
          <MenuItem disabled sx={{ py: 2, px: 2 }}>
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
              >
                <Avatar
                  src={user.avatar}
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: isDark
                      ? alpha(primaryColor, 0.3)
                      : alpha(primaryColor, 0.2),
                    color: isDark ? textLight : textDark,
                    fontWeight: 600,
                  }}
                >
                  {user.name?.[0]?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography
                    fontWeight={700}
                    fontSize="0.95rem"
                    color={isDark ? textLight : textDark}
                  >
                    {user.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={isDark ? "text.secondary" : "text.disabled"}
                  >
                    {user.email}
                  </Typography>
                  <Chip
                    label={user.role?.replace("_", " ") || "Analyst"}
                    size="small"
                    sx={{
                      mt: 0.5,
                      backgroundColor: isDark
                        ? alpha(primaryColor, 0.2)
                        : alpha(primaryColor, 0.1),
                      color: isDark ? primaryColor : textDark,
                      fontWeight: 600,
                      fontSize: "0.65rem",
                      border: isDark
                        ? `1px solid ${alpha(primaryColor, 0.3)}`
                        : "none",
                    }}
                  />
                </Box>
              </Box>
              <Divider sx={{ my: 1, borderColor: borderColor }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CorporateFareIcon
                  fontSize="small"
                  color={isDark ? "action" : "disabled"}
                />
                <Typography
                  variant="caption"
                  color={isDark ? "text.secondary" : "text.disabled"}
                >
                  GCB Bank • ESG Analytics Division
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <Divider sx={{ borderColor: borderColor }} />
          <MenuItem
            onClick={() => navigate("/profile")}
            sx={{ py: 1.5, px: 2 }}
          >
            <PersonIcon
              fontSize="small"
              sx={{ mr: 2, color: isDark ? "text.secondary" : "text.disabled" }}
            />
            <Typography color={isDark ? textLight : textDark}>
              Profile Settings
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => navigate("/settings")}
            sx={{ py: 1.5, px: 2 }}
          >
            <SettingsIcon
              fontSize="small"
              sx={{ mr: 2, color: isDark ? "text.secondary" : "text.disabled" }}
            />
            <Typography color={isDark ? textLight : textDark}>
              System Preferences
            </Typography>
          </MenuItem>
          <Divider sx={{ borderColor: borderColor }} />
          <MenuItem
            onClick={handleLogout}
            sx={{
              py: 1.5,
              px: 2,
              color: isDark ? "#EF4444" : "#DC2626",
              "&:hover": {
                backgroundColor: isDark
                  ? alpha("#EF4444", 0.1)
                  : alpha("#DC2626", 0.05),
              },
            }}
          >
            <LogoutIcon fontSize="small" sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
