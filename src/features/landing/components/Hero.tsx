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
          opacity: isDark ? 0.15 : 0.08,
          zIndex: 0,
          filter: isDark
            ? "brightness(70%) grayscale(20%)"
            : "brightness(120%) grayscale(100%)",
        }}
      >
        <source
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          type="video/mp4"
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: isDark ? alpha("#0F172A", 0.25) : alpha("#FFFFFF", 0.25),
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
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
                  Enter Platform
                </Button>
                {/* Modules dropdown menu */}
                <Menu
                  anchorEl={modulesAnchorEl}
                  open={Boolean(modulesAnchorEl)}
                  onClose={handleModulesClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={handleModulesClose}>
                    Climate Risk Assessment
                  </MenuItem>
                  <MenuItem onClick={handleModulesClose}>
                    Scenario Analysis & Stress Testing
                  </MenuItem>
                  <MenuItem onClick={handleModulesClose}>
                    SDG & NDC Alignment
                  </MenuItem>
                  <MenuItem onClick={handleModulesClose}>
                    Capacity building
                  </MenuItem>
                </Menu>
              </Stack>
            </Box>
          </Container>
        </Box>

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
                    platform tailored for banks and financial institutions in
                    emerging markets.
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
                    "Scenario Analysis & Stress Testing",
                    "SDG & NDC Alignment",
                    "Capacity Building",
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

// import { Link } from "react-router-dom";
// import { Tooltip } from "./Tooltip";
// import { ASSET_BASE } from '../../api/client'

// interface HighlightItem {
//   title: string;
//   copy: string;
// }

// interface HeroSectionProps {
//   liveModuleNames: string;
//   heroHighlights: HighlightItem[];
//   primaryCtaHref: string;
//   primaryCtaLabel: string;
//   secondaryCtaHref: string;
//   secondaryCtaLabel: string;
//   onNavigateToHash: (hash: string) => void;
// }

// const featureIcons = [
//   <svg
//     key="shield"
//     className="h-5 w-5"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//     />
//   </svg>,
//   <svg
//     key="chart"
//     className="h-5 w-5"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//     />
//   </svg>,
//   <svg
//     key="doc"
//     className="h-5 w-5"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//     />
//   </svg>,
//   <svg
//     key="cog"
//     className="h-5 w-5"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
//     />
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//     />
//   </svg>,
// ];

// export function HeroSection({
//   liveModuleNames,
//   heroHighlights,
//   primaryCtaHref,
//   primaryCtaLabel,
//   secondaryCtaHref,
//   secondaryCtaLabel,
//   onNavigateToHash,
// }: HeroSectionProps) {
//   return (
//     <div className="relative isolate min-h-[92vh] overflow-hidden">
//       <div className="absolute inset-0" style={{ zIndex: 0 }}>
//         <video
//           autoPlay
//           loop
//           muted
//           playsInline
//           preload="auto"
//           className="h-full w-full object-cover opacity-20 dark:opacity-10"
//           onLoadedData={(e) => {
//             const video = e.currentTarget;
//             video.play().catch(() => {
//               console.log("Video autoplay prevented");
//             });
//           }}
//         >
//           <source src={`${ASSET_BASE}/static/assets/video/office.mp4`} type="video/mp4" />
//         </video>
//       </div>

//       <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/80 via-[var(--bg)]/60 to-[var(--bg)]/90" style={{ zIndex: 1 }} />

//       <div className="pointer-events-none absolute inset-0" style={{ zIndex: 2 }}>
//         <div
//           className="absolute left-1/2 top-0 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-[var(--primary)]/25 blur-[180px]"
//           style={{ animation: "pulse 10s ease-in-out infinite" }}
//           aria-hidden="true"
//         />
//         <div
//           className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-[var(--primary-600)]/20 blur-[150px]"
//           style={{
//             animation: "pulse 12s ease-in-out infinite",
//             animationDelay: "3s",
//           }}
//           aria-hidden="true"
//         />
//         <div
//           className="absolute -bottom-20 -right-20 h-[500px] w-[500px] rounded-full bg-[var(--primary)]/15 blur-[120px]"
//           style={{
//             animation: "pulse 14s ease-in-out infinite",
//             animationDelay: "5s",
//           }}
//           aria-hidden="true"
//         />
//       </div>

//       <div
//         className="pointer-events-none absolute inset-0 opacity-[0.08]"
//         style={{
//           backgroundImage: `
//             linear-gradient(rgba(134, 188, 37, 0.3) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(134, 188, 37, 0.3) 1px, transparent 1px)
//           `,
//           backgroundSize: "80px 80px",
//           zIndex: 2,
//         }}
//         aria-hidden="true"
//       />

//       <div
//         className="pointer-events-none absolute inset-0"
//         style={{
//           background:
//             "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(134, 188, 37, 0.15), transparent)",
//           zIndex: 2,
//         }}
//         aria-hidden="true"
//       />

//       <section className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24" style={{ zIndex: 3 }}>
//         <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 lg:items-end">
//           <div className="max-w-3xl space-y-8">
//             <div className="space-y-1">
//               <h1 className="text-6xl font-black leading-[1.05] tracking-tight text-[var(--text-strong)] dark:text-slate-100 sm:text-7xl lg:text-8xl">
//                 Credit Risk
//               </h1>
//               <div className="relative">
//                 <span
//                   className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] via-[#a8e04f] to-[var(--primary-600)] bg-clip-text text-6xl font-black tracking-tight text-transparent blur-xl opacity-60 sm:text-7xl lg:text-8xl"
//                   aria-hidden="true"
//                 >
//                   Management
//                 </span>
//                 <span className="relative bg-gradient-to-r from-[var(--primary)] via-[#a8e04f] to-[var(--primary-600)] bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl lg:text-8xl">
//                   Management
//                 </span>
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               <div className="h-[2px] w-16 bg-gradient-to-r from-[var(--primary)] to-transparent"></div>
//               <span className="text-2xl font-semibold tracking-wide text-[var(--text-strong)] dark:text-slate-300 sm:text-3xl">
//                 Simplified
//               </span>
//             </div>

//             <p className="text-lg leading-relaxed text-[var(--muted)] dark:text-white/70 sm:text-xl max-w-2xl">
//               Launch purpose-built workspaces with our comprehensive demo
//               portfolio.{" "}
//               <Tooltip content="International Financial Reporting Standard 9 - Expected Credit Loss accounting">
//                 <span className="font-medium text-[var(--text)] dark:text-white/90 underline decoration-[var(--primary)]/30 underline-offset-2">IFRS 9</span>
//               </Tooltip>{" "}
//               compliance,{" "}
//               <Tooltip content="Basel Standardised Approach - regulatory capital requirements">
//                 <span className="font-medium text-[var(--text)] dark:text-white/90 underline decoration-[var(--primary)]/30 underline-offset-2">Basel SA</span>
//               </Tooltip>{" "}
//               capital calculations, and portfolio analytics—all in one platform
//               with built-in governance.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 pt-2">
//               <Link
//                 to={primaryCtaHref}
//                 className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl px-10 py-4 text-base font-semibold shadow-xl transition-all duration-300 hover:shadow-2xl hover:no-underline"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, var(--primary) 0%, var(--primary-600) 50%, var(--primary) 100%)",
//                   backgroundSize: "200% 200%",
//                   animation: "shimmer 3s ease-in-out infinite",
//                   boxShadow:
//                     "0 10px 40px -10px rgba(134, 188, 37, 0.5)",
//                 }}
//               >
//                 <span className="relative z-10 text-[#041003]">
//                   {primaryCtaLabel}
//                 </span>
//                 <svg
//                   className="relative z-10 h-4 w-4 text-[#041003] transition-transform duration-300 group-hover:translate-x-1"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={2.5}
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M13 7l5 5m0 0l-5 5m5-5H6"
//                   />
//                 </svg>
//               </Link>

//               <a
//                 href={secondaryCtaHref}
//                 onClick={(event) => {
//                   event.preventDefault();
//                   onNavigateToHash(secondaryCtaHref);
//                 }}
//                 className="group inline-flex items-center justify-center gap-3 rounded-xl border border-[var(--border)] dark:border-slate-700/50 bg-transparent px-10 py-4 text-base font-semibold text-[var(--text-strong)] dark:text-white transition-all duration-300 hover:border-[var(--primary)]/50 hover:bg-[var(--surface)] dark:hover:bg-slate-800/50 hover:no-underline"
//               >
//                 {secondaryCtaLabel}
//                 <svg
//                   className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={2.5}
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </a>
//             </div>

//             <div className="flex flex-wrap gap-6 pt-4 text-sm text-[var(--muted)] dark:text-white/60">
//               <div className="flex items-center gap-2">
//                 <div className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]"></div>
//                 <span>Basel III Compliant</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]"></div>
//                 <span>IFRS 9 Ready</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]"></div>
//                 <span>Enterprise Security</span>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-4 lg:pt-8">
//             {heroHighlights.map((item, index) => (
//               <div
//                 key={item.title}
//                 className="group relative overflow-hidden rounded-2xl bg-[var(--surface)] dark:bg-slate-900/40 border border-[var(--border)] dark:border-slate-800/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[var(--primary)]/40 hover:shadow-lg hover:shadow-[var(--primary)]/5"
//               >
//                 <div className="flex items-start gap-5">
//                   <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] transition-all duration-300 group-hover:bg-[var(--primary)]/15 group-hover:scale-105">
//                     {featureIcons[index % featureIcons.length]}
//                   </div>

//                   <div className="flex-1 space-y-1.5">
//                     <h3 className="text-base font-semibold leading-tight text-[var(--text-strong)] dark:text-white transition-colors duration-300 group-hover:text-[var(--primary)]">
//                       {item.title}
//                     </h3>
//                     <p className="text-sm leading-relaxed text-[var(--muted)] dark:text-white/65">
//                       {item.copy}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-[var(--primary)]/0 via-[var(--primary)]/40 to-[var(--primary)]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <style>{`
//         @keyframes shimmer {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default HeroSection;
