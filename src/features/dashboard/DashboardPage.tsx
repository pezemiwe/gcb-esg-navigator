import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme, Paper, Stack, alpha } from "@mui/material";
import DashboardNavbar from "@/components/layout/DashboardNavbar/DashboardNavbar";
import { useAuthStore } from "@/store/authStore";
import { useCRADataStore } from "@/store/craStore";
import {
  Database,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user } = useAuthStore();
  const { assets } = useCRADataStore();
  const navigate = useNavigate();

  if (!user) return null;

  const uploadedAssetTypes = Object.keys(assets).length;
  const totalRecords = Object.values(assets).reduce(
    (sum, asset) => sum + asset.rowCount,
    0,
  );
  const totalExposure = Object.values(assets).reduce(
    (sum, asset) =>
      sum + asset.data.reduce((s, a) => s + (a.outstandingBalance || 0), 0),
    0,
  );
  const lastUpload = Object.values(assets).reduce(
    (latest, asset) => {
      if (!asset.uploadedAt) return latest;
      return !latest || new Date(asset.uploadedAt) > new Date(latest)
        ? asset.uploadedAt
        : latest;
    },
    null as string | null,
  );

  return (
    <Box
      sx={{ minHeight: "100vh", background: isDark ? "#0F172A" : "#F8FAFC" }}
    >
      <DashboardNavbar />
      <Box sx={{ maxWidth: 1280, mx: "auto", px: 3, py: 5 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          mb={4}
          sx={{ color: isDark ? "#fff" : "#0F172A" }}
        >
          Hi, {user.name}
        </Typography>

        {uploadedAssetTypes > 0 ? (
          <>
            <Typography
              variant="h6"
              fontWeight={600}
              mb={3}
              sx={{ color: isDark ? alpha("#FFFFFF", 0.8) : "#475569" }}
            >
              CRA Data Overview
            </Typography>
            <Stack direction="row" spacing={3} mb={4} flexWrap="wrap">
              <Paper
                elevation={0}
                sx={{
                  flex: "1 1 250px",
                  p: 3,
                  backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                  border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                  borderRadius: 2.5,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "#FDB913",
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => navigate("/cra/data")}
              >
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      backgroundColor: alpha("#FDB913", 0.12),
                      borderRadius: 2,
                      display: "flex",
                    }}
                  >
                    <Database size={24} color="#FDB913" />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Asset Types
                  </Typography>
                </Stack>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: "#FDB913",
                    mb: 0.5,
                  }}
                >
                  {uploadedAssetTypes}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                  }}
                >
                  Uploaded
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  flex: "1 1 250px",
                  p: 3,
                  backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                  border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                  borderRadius: 2.5,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      backgroundColor: alpha("#10B981", 0.12),
                      borderRadius: 2,
                      display: "flex",
                    }}
                  >
                    <FileSpreadsheet size={24} color="#10B981" />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Total Records
                  </Typography>
                </Stack>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: "#10B981",
                    mb: 0.5,
                  }}
                >
                  {totalRecords.toLocaleString()}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                  }}
                >
                  Data Points
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  flex: "1 1 250px",
                  p: 3,
                  backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                  border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                  borderRadius: 2.5,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      backgroundColor: alpha("#3B82F6", 0.12),
                      borderRadius: 2,
                      display: "flex",
                    }}
                  >
                    <TrendingUp size={24} color="#3B82F6" />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Total Exposure
                  </Typography>
                </Stack>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: "#3B82F6",
                    mb: 0.5,
                    fontSize: "2rem",
                  }}
                >
                  ₵{(totalExposure / 1000000).toFixed(1)}M
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                  }}
                >
                  Portfolio Value
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  flex: "1 1 250px",
                  p: 3,
                  backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                  border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                  borderRadius: 2.5,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      backgroundColor: alpha("#10B981", 0.12),
                      borderRadius: 2,
                      display: "flex",
                    }}
                  >
                    <CheckCircle2 size={24} color="#10B981" />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Last Upload
                  </Typography>
                </Stack>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: isDark ? "#FFFFFF" : "#0F172A",
                    mb: 0.5,
                  }}
                >
                  {lastUpload
                    ? new Date(lastUpload).toLocaleDateString()
                    : "N/A"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                  }}
                >
                  {lastUpload
                    ? new Date(lastUpload).toLocaleTimeString()
                    : "No uploads yet"}
                </Typography>
              </Paper>
            </Stack>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                borderRadius: 2.5,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                mb={2}
                sx={{ color: isDark ? "#FFFFFF" : "#0F172A" }}
              >
                Uploaded Asset Types
              </Typography>
              <Stack spacing={2}>
                {Object.entries(assets).map(([key, asset]) => (
                  <Box
                    key={key}
                    sx={{
                      p: 2,
                      backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                      borderRadius: 1.5,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: isDark
                          ? alpha("#FDB913", 0.08)
                          : alpha("#FDB913", 0.05),
                      },
                    }}
                    onClick={() => navigate(`/cra/data/${key}`)}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: isDark ? "#FFFFFF" : "#0F172A",
                            mb: 0.5,
                          }}
                        >
                          {asset.type
                            .split("_")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.8125rem",
                            color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                          }}
                        >
                          {asset.fileName} · {asset.rowCount.toLocaleString()}{" "}
                          rows
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            color: "#10B981",
                            fontWeight: 600,
                          }}
                        >
                          {asset.validationStatus === "validated"
                            ? "✓ Validated"
                            : "Pending"}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.8125rem",
                            color: isDark ? alpha("#FFFFFF", 0.5) : "#94A3B8",
                          }}
                        >
                          {new Date(asset.uploadedAt!).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
              border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
              borderRadius: 2.5,
            }}
          >
            <Database
              size={48}
              color="#64748B"
              style={{ margin: "0 auto 16px" }}
            />
            <Typography
              variant="h6"
              fontWeight={600}
              mb={1}
              sx={{ color: isDark ? "#FFFFFF" : "#0F172A" }}
            >
              No Data Uploaded Yet
            </Typography>
            <Typography
              sx={{
                fontSize: "0.9375rem",
                color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                mb: 3,
              }}
            >
              Upload your financial asset data to get started with climate risk
              assessment
            </Typography>
            <Box
              onClick={() => navigate("/cra/data")}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 3,
                py: 1.5,
                backgroundColor: "#FDB913",
                color: "#0F172A",
                borderRadius: 1.5,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "#F59E0B",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Database size={18} />
              Upload Data
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
