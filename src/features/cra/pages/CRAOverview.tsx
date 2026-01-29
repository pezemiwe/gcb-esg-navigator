import {
  Box,
  Typography,
  Paper,
  Stack,
  LinearProgress,
  alpha,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCRAStatusStore, useCRADataStore } from "@/store/craStore";
import {
  TrendingUp,
  Database,
  PieChart,
  Map,
  CheckCircle2,
  Clock,
  Building2,
  FileText,
} from "lucide-react";
import CRALayout from "../layout/CRALayout";

export default function CRAOverview() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const craStatus = useCRAStatusStore();
  const { assets } = useCRADataStore();

  const totalAssets = Object.values(assets).reduce(
    (sum, asset) => sum + asset.rowCount,
    0,
  );
  const uploadedTypes = Object.keys(assets).length;

  const modules = [
    {
      id: "data",
      title: "CRA Data",
      description: "Upload and manage financial asset data",
      icon: <Database size={24} />,
      status: craStatus.dataUploaded,
      path: "/cra/data",
      color: "#FDB913",
    },
    {
      id: "segmentation",
      title: "Portfolio Segmentation",
      description: "Categorize assets by sector, geography, and risk factors",
      icon: <PieChart size={24} />,
      status: craStatus.segmentationReady,
      path: "/cra/segmentation",
      color: "#FDB913",
    },
    {
      id: "physical-risk",
      title: "Physical Risk Mapping",
      description: "Map geographic exposure to climate hazards",
      icon: <Map size={24} />,
      status: craStatus.praReady,
      path: "/cra/physical-risk",
      color: "#FDB913",
    },
    {
      id: "transition-risk",
      title: "Transition Risk Analytics",
      description: "Analyze low-carbon economy transition exposure",
      icon: <TrendingUp size={24} />,
      status: craStatus.traReady,
      path: "/cra/transition-risk",
      color: "#FDB913",
    },
    {
      id: "collateral",
      title: "Collateral Sensitivity",
      description: "Climate impact on collateral values",
      icon: <Building2 size={24} />,
      status: false,
      path: "/cra/collateral",
      color: "#FDB913",
    },
    {
      id: "reporting",
      title: "CRA Reporting",
      description: "Generate comprehensive climate risk reports",
      icon: <FileText size={24} />,
      status: false,
      path: "/cra/reporting",
      color: "#FDB913",
    },
  ];

  const overallProgress =
    (modules.filter((m) => m.status).length / modules.length) * 100;

  const getStatusIcon = (status: boolean) => {
    if (status) return <CheckCircle2 size={20} color="#10B981" />;
    return <Clock size={20} color={isDark ? "#64748B" : "#94A3B8"} />;
  };

  return (
    <CRALayout>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Stack spacing={4}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={2} mb={1}>
              <Box
                sx={{
                  p: 1.5,
                  backgroundColor: alpha("#FDB913", 0.12),
                  borderRadius: 2,
                  display: "flex",
                }}
              >
                <TrendingUp size={28} color="#FDB913" strokeWidth={2.5} />
              </Box>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: isDark ? "#FFFFFF" : "#0F172A",
                    fontSize: { xs: "1.75rem", md: "2.25rem" },
                  }}
                >
                  Climate Risk Assessment
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.875rem", md: "1rem" },
                    color: isDark ? alpha("#FFFFFF", 0.65) : "#64748B",
                    mt: 0.5,
                  }}
                >
                  Understand physical and transition climate risks in your
                  portfolio
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Paper
            elevation={0}
            sx={{
              backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
              border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
              borderRadius: 2.5,
              p: 3,
            }}
          >
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: isDark ? "#FFFFFF" : "#0F172A",
                }}
              >
                Overall CRA Progress
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#FDB913",
                }}
              >
                {Math.round(overallProgress)}% Complete
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={overallProgress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: isDark ? alpha("#334155", 0.3) : "#E2E8F0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#FDB913",
                  borderRadius: 4,
                },
              }}
            />
          </Paper>

          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <Paper
              elevation={0}
              sx={{
                flex: "1 1 calc(25% - 18px)",
                minWidth: 200,
                backgroundColor: isDark ? alpha("#1E293B", 0.5) : "#F8FAFC",
                borderRadius: 2,
                p: 3,
                border: `1px solid ${isDark ? alpha("#334155", 0.3) : "#E2E8F0"}`,
              }}
            >
              <Typography
                sx={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: "#FDB913",
                  mb: 0.5,
                  lineHeight: 1,
                }}
              >
                {uploadedTypes}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.8125rem",
                  color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Asset Types Uploaded
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                flex: "1 1 calc(25% - 18px)",
                minWidth: 200,
                backgroundColor: isDark ? alpha("#1E293B", 0.5) : "#F8FAFC",
                borderRadius: 2,
                p: 3,
                border: `1px solid ${isDark ? alpha("#334155", 0.3) : "#E2E8F0"}`,
              }}
            >
              <Typography
                sx={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: "#FDB913",
                  mb: 0.5,
                  lineHeight: 1,
                }}
              >
                {totalAssets.toLocaleString()}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.8125rem",
                  color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Total Assets
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                flex: "1 1 calc(25% - 18px)",
                minWidth: 200,
                backgroundColor: isDark ? alpha("#1E293B", 0.5) : "#F8FAFC",
                borderRadius: 2,
                p: 3,
                border: `1px solid ${isDark ? alpha("#334155", 0.3) : "#E2E8F0"}`,
              }}
            >
              <Typography
                sx={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: "#10B981",
                  mb: 0.5,
                  lineHeight: 1,
                }}
              >
                {modules.filter((m) => m.status).length}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.8125rem",
                  color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Modules Completed
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                flex: "1 1 calc(25% - 18px)",
                minWidth: 200,
                backgroundColor: isDark ? alpha("#1E293B", 0.5) : "#F8FAFC",
                borderRadius: 2,
                p: 3,
                border: `1px solid ${isDark ? alpha("#334155", 0.3) : "#E2E8F0"}`,
              }}
            >
              <Typography
                sx={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: isDark ? "#64748B" : "#94A3B8",
                  mb: 0.5,
                  lineHeight: 1,
                }}
              >
                {modules.filter((m) => !m.status).length}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.8125rem",
                  color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Pending Setup
              </Typography>
            </Paper>
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                color: isDark ? "#FFFFFF" : "#0F172A",
                fontSize: "1.25rem",
                mb: 3,
              }}
            >
              CRA Modules
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {modules.map((module) => (
                <Paper
                  key={module.id}
                  elevation={0}
                  onClick={() => navigate(module.path)}
                  sx={{
                    flex: "1 1 calc(50% - 12px)",
                    minWidth: 320,
                    backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                    border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                    borderRadius: 2,
                    p: 3,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: module.color,
                      transform: "translateY(-2px)",
                      boxShadow: `0 4px 12px ${alpha(module.color, 0.15)}`,
                    },
                  }}
                >
                  <Stack direction="row" spacing={3} alignItems="flex-start">
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: alpha(module.color, 0.1),
                        borderRadius: 2,
                        display: "flex",
                      }}
                    >
                      {module.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: isDark ? "#FFFFFF" : "#0F172A",
                            fontSize: "1.125rem",
                          }}
                        >
                          {module.title}
                        </Typography>
                        {getStatusIcon(module.status)}
                      </Stack>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                        }}
                      >
                        {module.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Box>
          </Box>
        </Stack>
      </Box>
    </CRALayout>
  );
}
