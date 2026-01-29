import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  alpha,
  IconButton,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  PlayCircle,
  Security,
  Assessment,
  Analytics,
  Brightness4,
  Brightness7,
  Shield,
  ShowChart,
  EmojiEvents,
  School,
  Note,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import { useThemeStore } from "../../../store/themeStore";

export default function BankingLandingPage() {
  // State for modules menu
  const [modulesAnchorEl, setModulesAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const handleModulesClose = () => {
    setModulesAnchorEl(null);
  };
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Video Background Layer - zIndex: 0 */}
      <Box
        component="video"
        autoPlay
        loop
        muted
        playsInline
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: isDark ? 0.1 : 0.2,
          zIndex: 0,
        }}
      >
        <source
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          type="video/mp4"
        />
      </Box>

      {/* Gradient Overlay - zIndex: 1 */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: isDark
            ? `linear-gradient(to bottom, 
                ${alpha("#0F172A", 0.8)} 0%, 
                ${alpha("#0F172A", 0.6)} 50%, 
                ${alpha("#0F172A", 0.9)} 100%)`
            : `linear-gradient(to bottom, 
                ${alpha("#FFFFFF", 0.8)} 0%, 
                ${alpha("#FFFFFF", 0.6)} 50%, 
                ${alpha("#FFFFFF", 0.9)} 100%)`,
          zIndex: 1,
        }}
      />

      {/* Animated Blur Orbs - zIndex: 2 */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "1000px",
          height: "1000px",
          borderRadius: "50%",
          background: alpha("#FDB913", 0.25),
          filter: "blur(180px)",
          zIndex: 2,
          pointerEvents: "none",
          animation: "pulse 10s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": { opacity: 1 },
            "50%": { opacity: 0.6 },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-160px",
          left: "-160px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: alpha("#D97706", 0.2),
          filter: "blur(150px)",
          zIndex: 2,
          pointerEvents: "none",
          animation: "pulse 12s ease-in-out infinite",
          animationDelay: "3s",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-80px",
          right: "-80px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: alpha("#FDB913", 0.15),
          filter: "blur(120px)",
          zIndex: 2,
          pointerEvents: "none",
          animation: "pulse 14s ease-in-out infinite",
          animationDelay: "5s",
        }}
      />

      {/* Grid Pattern Overlay - zIndex: 2 */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.08,
          backgroundImage: `
            linear-gradient(${alpha("#FDB913", 0.3)} 1px, transparent 1px),
            linear-gradient(90deg, ${alpha("#FDB913", 0.3)} 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Radial Gradient Accent - zIndex: 2 */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${alpha("#FDB913", 0.15)}, transparent)`,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Main Content - zIndex: 3 */}
      <Box
        sx={{
          position: "relative",
          zIndex: 3,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: isDark
              ? alpha("#1E293B", 0.95)
              : alpha("#FFFFFF", 0.98),
            borderBottom: `1px solid ${isDark ? alpha("#334155", 0.3) : alpha("#E2E8F0", 0.8)}`,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 72,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  component="img"
                  src="/assets/images/gcb_dark.png"
                  alt="GCB Bank"
                  sx={{
                    height: 32,
                    width: "auto",
                  }}
                />
                <Box
                  sx={{
                    height: 24,
                    width: "1px",
                    backgroundColor: isDark ? alpha("#475569", 0.5) : "#E2E8F0",
                    display: { xs: "none", sm: "block" },
                  }}
                />
                <Typography
                  sx={{
                    color: isDark ? "#94A3B8" : "#475569",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    letterSpacing: "0.02em",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  ESG Navigator
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    color: isDark ? "#94A3B8" : "#64748B",
                    "&:hover": {
                      backgroundColor: isDark
                        ? alpha("#475569", 0.2)
                        : alpha("#64748B", 0.1),
                    },
                  }}
                >
                  {isDark ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
                <Button
                  variant="contained"
                  onClick={(e) => setModulesAnchorEl(e.currentTarget)}
                  sx={{
                    backgroundColor: isDark ? "#334155" : "#475569",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    textTransform: "none",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: isDark ? "#475569" : "#334155",
                      boxShadow: `0 4px 12px ${alpha("#334155", 0.3)}`,
                    },
                  }}
                >
                  Select Module
                </Button>
                {/* Modules dropdown menu */}
                <Menu
                  anchorEl={modulesAnchorEl}
                  open={Boolean(modulesAnchorEl)}
                  onClose={handleModulesClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 300,
                      borderRadius: "12px",
                      backgroundColor: isDark ? "#1E293B" : "#F8FAFC",
                      border: `1px solid ${isDark ? alpha("#334155", 0.4) : "#E2E8F0"}`,
                      boxShadow: `0 10px 40px ${alpha("#000000", isDark ? 0.5 : 0.08)}`,
                      "& .MuiList-root": {
                        py: 1.5,
                        px: 1,
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderBottom: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: isDark ? "#94A3B8" : "#64748B",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      Modules
                    </Typography>
                  </Box>
                  <MenuItem
                    onClick={handleModulesClose}
                    sx={{
                      py: 1.5,
                      px: 2,
                      mx: 0.5,
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      "&:hover": {
                        backgroundColor: isDark
                          ? alpha("#334155", 0.6)
                          : "#FFFFFF",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "8px",
                        backgroundColor: isDark
                          ? alpha("#475569", 0.3)
                          : "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Shield sx={{ fontSize: 18, color: "#64748B" }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: isDark ? "#FFFFFF" : "#0F172A",
                          lineHeight: 1.3,
                        }}
                      >
                        Climate Risk Assessment
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: isDark ? "#94A3B8" : "#64748B",
                          lineHeight: 1.3,
                          mt: 0.25,
                        }}
                      >
                        Risk evaluation & analysis
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem
                    onClick={handleModulesClose}
                    sx={{
                      py: 1.5,
                      px: 2,
                      mx: 0.5,
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      "&:hover": {
                        backgroundColor: isDark
                          ? alpha("#334155", 0.6)
                          : "#FFFFFF",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "8px",
                        backgroundColor: isDark
                          ? alpha("#475569", 0.3)
                          : "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <ShowChart sx={{ fontSize: 18, color: "#64748B" }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: isDark ? "#FFFFFF" : "#0F172A",
                          lineHeight: 1.3,
                        }}
                      >
                        Scenario Analysis & Stress Testing
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: isDark ? "#94A3B8" : "#64748B",
                          lineHeight: 1.3,
                          mt: 0.25,
                        }}
                      >
                        Stress testing & analytics
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem
                    onClick={handleModulesClose}
                    sx={{
                      py: 1.5,
                      px: 2,
                      mx: 0.5,
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      "&:hover": {
                        backgroundColor: isDark
                          ? alpha("#334155", 0.6)
                          : "#FFFFFF",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "8px",
                        backgroundColor: isDark
                          ? alpha("#475569", 0.3)
                          : "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <EmojiEvents sx={{ fontSize: 18, color: "#64748B" }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: isDark ? "#FFFFFF" : "#0F172A",
                          lineHeight: 1.3,
                        }}
                      >
                        SDG & NDC Alignment
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: isDark ? "#94A3B8" : "#64748B",
                          lineHeight: 1.3,
                          mt: 0.25,
                        }}
                      >
                        Sustainability goals
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem
                    onClick={handleModulesClose}
                    sx={{
                      py: 1.5,
                      px: 2,
                      mx: 0.5,
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      "&:hover": {
                        backgroundColor: isDark
                          ? alpha("#334155", 0.6)
                          : "#FFFFFF",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "8px",
                        backgroundColor: isDark
                          ? alpha("#475569", 0.3)
                          : "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <School sx={{ fontSize: 18, color: "#64748B" }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: isDark ? "#FFFFFF" : "#0F172A",
                          lineHeight: 1.3,
                        }}
                      >
                        Capacity Building
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: isDark ? "#94A3B8" : "#64748B",
                          lineHeight: 1.3,
                          mt: 0.25,
                        }}
                      >
                        Training & development
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem
                    onClick={handleModulesClose}
                    sx={{
                      py: 1.5,
                      px: 2,
                      mx: 0.5,
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      "&:hover": {
                        backgroundColor: isDark
                          ? alpha("#334155", 0.6)
                          : "#FFFFFF",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "8px",
                        backgroundColor: isDark
                          ? alpha("#475569", 0.3)
                          : "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Note sx={{ fontSize: 18, color: "#64748B" }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: isDark ? "#FFFFFF" : "#0F172A",
                          lineHeight: 1.3,
                        }}
                      >
                        Materiality Topic Assessment
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: isDark ? "#94A3B8" : "#64748B",
                          lineHeight: 1.3,
                          mt: 0.25,
                        }}
                      >
                        Assess materiality topics
                      </Typography>
                    </Box>
                  </MenuItem>
                </Menu>
              </Stack>
            </Box>
          </Container>
        </Box>

        {/* Hero Content */}
        <Container
          maxWidth="lg"
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            py: 4,
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: { xs: 8, md: 12 },
                alignItems: "center",
              }}
            >
              <Box>
                <Box
                  sx={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.8s ease, transform 0.8s ease",
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2.5,
                      py: 1,
                      backgroundColor: alpha("#FDB913", 0.15),
                      borderRadius: "6px",
                      mb: 4,
                      border: `1px solid ${alpha("#FDB913", 0.3)}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#FDB913",
                      }}
                    />
                    <Typography
                      sx={{
                        color: isDark ? "#FDB913" : "#D97706",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        letterSpacing: "0.05em",
                      }}
                    >
                      ENTERPRISE RISK INTELLIGENCE
                    </Typography>
                  </Box>

                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: {
                        xs: "2.2rem",
                        sm: "2.8rem",
                        md: "3.5rem",
                        lg: "4.2rem",
                      },
                      fontWeight: 800,
                      lineHeight: 1.08,
                      color: isDark ? "#fff" : "#1a202c",
                      mb: 3,
                      letterSpacing: "-0.04em",
                      textShadow: isDark
                        ? "0 2px 16px rgba(0,0,0,0.45)"
                        : "0 2px 12px rgba(253,185,19,0.08)",
                      textAlign: { xs: "left", md: "left" },
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        display: "block",
                        fontWeight: 700,
                        color: isDark ? "#fff" : "#1a202c",
                        fontSize: {
                          xs: "1.2rem",
                          sm: "1.5rem",
                          md: "2rem",
                          lg: "2.2rem",
                        },
                        mt: 1,
                        letterSpacing: "-0.01em",
                        textShadow: isDark
                          ? "0 2px 12px rgba(0,0,0,0.25)"
                          : "0 2px 8px rgba(253,185,19,0.08)",
                      }}
                    >
                      Transforming Climate Risk into
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        display: "block",
                        fontWeight: 900,
                        color: isDark ? "#FDB913" : "#B7791F",
                        letterSpacing: "-0.03em",
                        textShadow: isDark
                          ? "0 4px 24px rgba(253,185,19,0.25)"
                          : "0 2px 12px rgba(253,185,19,0.18)",
                        fontSize: {
                          xs: "2.5rem",
                          sm: "3.2rem",
                          md: "4.2rem",
                          lg: "5rem",
                        },
                        lineHeight: 1.05,
                      }}
                    >
                      Opportunity
                    </Box>
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "1.125rem",
                      lineHeight: 1.7,
                      color: isDark ? alpha("#FFFFFF", 0.8) : "#475569",
                      mb: 4,
                      maxWidth: 520,
                      fontWeight: 400,
                    }}
                  >
                    Comprehensive climate risk assessment and management
                    platform
                  </Typography>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    mb={4}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<PlayCircle />}
                      onClick={() => navigate("/demo")}
                      sx={{
                        borderColor: isDark ? alpha("#475569", 0.5) : "#CBD5E1",
                        color: isDark ? "#94A3B8" : "#475569",
                        px: 3,
                        py: 1,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        textTransform: "none",
                        borderRadius: "4px",
                        minWidth: 200,
                        backgroundColor: isDark
                          ? alpha("#1E293B", 0.3)
                          : alpha("#FFFFFF", 0.5),
                        "&:hover": {
                          borderColor: isDark ? "#FDB913" : "#F59E0B",
                          backgroundColor: alpha("#FDB913", 0.1),
                          color: "#FDB913",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      View Live Demo
                    </Button>
                  </Stack>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 3,
                      pt: 4,
                      borderTop: `1px solid ${isDark ? alpha("#475569", 0.3) : "#E2E8F0"}`,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Security sx={{ fontSize: 16, color: "#FDB913" }} />
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: isDark ? alpha("#FFFFFF", 0.7) : "#475569",
                        }}
                      >
                        Bank of Ghana Compliant
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Assessment sx={{ fontSize: 16, color: "#FDB913" }} />
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: isDark ? alpha("#FFFFFF", 0.7) : "#475569",
                        }}
                      >
                        ISO 27001 Certified
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Analytics sx={{ fontSize: 16, color: "#FDB913" }} />
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: isDark ? alpha("#FFFFFF", 0.7) : "#475569",
                        }}
                      >
                        TCFD Aligned
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(20px)",
                  transition:
                    "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2.5,
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      gridColumn: "1 / -1",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 1,
                      px: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        flex: 1,
                        height: 1,
                        backgroundColor: isDark
                          ? alpha("#475569", 0.4)
                          : "#E2E8F0",
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: isDark ? "#94A3B8" : "#64748B",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Platform Modules
                    </Typography>
                    <Box
                      sx={{
                        flex: 1,
                        height: 1,
                        backgroundColor: isDark
                          ? alpha("#475569", 0.4)
                          : "#E2E8F0",
                      }}
                    />
                  </Box>

                  {[
                    "Climate Risk Assessment",
                    "SDG & NDC Alignment",
                    "Capacity Building",
                    "Materiality Topic Assessment",
                    "Scenario Analysis & Stress Testing",
                  ].map((module, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "8px",
                        border: `1px solid ${isDark ? alpha("#475569", 0.4) : "#E2E8F0"}`,
                        backgroundColor: isDark
                          ? alpha("#1E293B", 0.6)
                          : alpha("#FFFFFF", 0.8),
                        p: 3,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          borderColor: "#FDB913",
                          boxShadow: `0 8px 32px ${alpha("#FDB913", 0.25)}`,
                          backgroundColor: isDark
                            ? alpha("#1E293B", 0.8)
                            : alpha("#FFFFFF", 0.95),
                        },
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: 3,
                          backgroundColor: "#FDB913",
                          transform: "translateY(-100%)",
                          transition: "transform 0.3s ease",
                        },
                        "&:hover::before": {
                          transform: "translateY(0)",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: isDark ? "#FFFFFF" : "#0F172A",
                          lineHeight: 1.4,
                          textAlign: "center",
                        }}
                      >
                        {module}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>

        {/* Footer */}
        <Box
          sx={{
            borderTop: `1px solid ${isDark ? alpha("#475569", 0.3) : alpha("#E2E8F0", 0.8)}`,
            backgroundColor: isDark
              ? alpha("#1E293B", 0.95)
              : alpha("#FFFFFF", 0.98),
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 3,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                  fontWeight: 500,
                }}
              >
                © {new Date().getFullYear()} GCB Bank. All rights reserved.
              </Typography>
              <Box sx={{ display: "flex", gap: 3 }}>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                    fontWeight: 500,
                    cursor: "pointer",
                    "&:hover": {
                      color: "#FDB913",
                    },
                  }}
                  onClick={() => navigate("/privacy")}
                >
                  Privacy Policy
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                    fontWeight: 500,
                    cursor: "pointer",
                    "&:hover": {
                      color: "#FDB913",
                    },
                  }}
                  onClick={() => navigate("/terms")}
                >
                  Terms of Service
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                    fontWeight: 500,
                    cursor: "pointer",
                    "&:hover": {
                      color: "#FDB913",
                    },
                  }}
                  onClick={() => navigate("/compliance")}
                >
                  Compliance
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
