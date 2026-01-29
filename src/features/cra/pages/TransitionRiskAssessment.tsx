import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  alpha,
  useTheme,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  TrendingUp,
  Settings,
  BarChart2,
  AlertCircle,
  Edit2,
  Save,
} from "lucide-react";
import { useTRARiskStore, useCRAStatusStore } from "@/store/craStore";
import CRALayout from "../layout/CRALayout";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TransitionRiskAssessment() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [activeTab, setActiveTab] = useState(0);
  const {
    sectorRiskScores,
    productRiskScores,
    setSectorRiskScores,
    setProductRiskScores,
  } = useTRARiskStore();
  const { traReady, setTRAReady } = useCRAStatusStore();
  const [editMode, setEditMode] = useState(false);

  // Initialize default scores if empty
  const defaultSectorScores = {
    "Oil & Gas": 9.5,
    "Coal Mining": 9.8,
    "Utilities (Fossil)": 8.7,
    "Heavy Manufacturing": 7.5,
    Aviation: 8.2,
    Shipping: 7.8,
    "Automotive (ICE)": 8.5,
    "Real Estate": 6.5,
    "Financial Services": 4.5,
    Technology: 3.2,
    "Renewable Energy": 2.1,
    Healthcare: 3.8,
  };

  const defaultProductScores = {
    "Project Finance (Fossil)": 9.2,
    "Corporate Loan (High Carbon)": 8.5,
    "Trade Finance (Energy)": 7.8,
    "Infrastructure Finance": 6.5,
    "Green Bonds": 2.0,
    "Sustainable Loans": 2.5,
  };

  const [localSectorScores, setLocalSectorScores] = useState(
    Object.keys(sectorRiskScores).length > 0
      ? sectorRiskScores
      : defaultSectorScores,
  );
  const [localProductScores, setLocalProductScores] = useState(
    Object.keys(productRiskScores).length > 0
      ? productRiskScores
      : defaultProductScores,
  );

  const handleSaveScores = () => {
    setSectorRiskScores(localSectorScores);
    setProductRiskScores(localProductScores);
    setEditMode(false);
  };

  const handleRunAssessment = () => {
    setSectorRiskScores(localSectorScores);
    setProductRiskScores(localProductScores);
    setTRAReady(true);
    setActiveTab(1);
  };

  const getRiskLevel = (
    score: number,
  ): { label: string; color: string; bg: string } => {
    if (score >= 8)
      return {
        label: "Very High",
        color: "#DC2626",
        bg: alpha("#DC2626", 0.15),
      };
    if (score >= 6)
      return { label: "High", color: "#EF4444", bg: alpha("#EF4444", 0.15) };
    if (score >= 4)
      return { label: "Medium", color: "#F59E0B", bg: alpha("#F59E0B", 0.15) };
    if (score >= 2)
      return { label: "Low", color: "#10B981", bg: alpha("#10B981", 0.15) };
    return { label: "Very Low", color: "#059669", bg: alpha("#059669", 0.15) };
  };

  // Mock aggregated exposure data
  const highRiskSectors = [
    {
      sector: "Oil & Gas",
      exposure: 850000000,
      assetCount: 342,
      riskScore: 9.5,
    },
    {
      sector: "Coal Mining",
      exposure: 420000000,
      assetCount: 156,
      riskScore: 9.8,
    },
    {
      sector: "Utilities (Fossil)",
      exposure: 680000000,
      assetCount: 278,
      riskScore: 8.7,
    },
    {
      sector: "Aviation",
      exposure: 530000000,
      assetCount: 198,
      riskScore: 8.2,
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <CRALayout>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Stack spacing={4}>
          {/* Header */}
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
                  Transition Risk Analytics
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.875rem", md: "1rem" },
                    color: isDark ? alpha("#FFFFFF", 0.65) : "#64748B",
                    mt: 0.5,
                  }}
                >
                  Analyze exposure to low-carbon economy transition and policy
                  changes
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Tabs */}
          <Paper
            elevation={0}
            sx={{
              backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
              border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
              borderRadius: 2.5,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{
                borderBottom: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                px: 2,
                "& .MuiTab-root": {
                  color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "0.9375rem",
                  "&.Mui-selected": {
                    color: "#FDB913",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#FDB913",
                },
              }}
            >
              <Tab
                icon={<Settings size={18} />}
                iconPosition="start"
                label="Risk Configuration"
              />
              <Tab
                icon={<BarChart2 size={18} />}
                iconPosition="start"
                label="Risk Results"
                disabled={!traReady}
              />
            </Tabs>

            {/* Configuration Tab */}
            <TabPanel value={activeTab} index={0}>
              <Box sx={{ p: 3 }}>
                <Stack spacing={4}>
                  {/* Instructions */}
                  <Paper
                    elevation={0}
                    sx={{
                      backgroundColor: alpha("#FDB913", 0.08),
                      border: `1px solid ${alpha("#FDB913", 0.3)}`,
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Stack direction="row" spacing={2}>
                      <AlertCircle size={20} color="#FDB913" />
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: isDark ? "#FFFFFF" : "#0F172A",
                            mb: 0.5,
                          }}
                        >
                          Configure Transition Risk Scores
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            color: isDark ? alpha("#FFFFFF", 0.75) : "#64748B",
                          }}
                        >
                          Assign risk scores (0-10) to sectors and product types
                          based on their exposure to carbon transition policies,
                          technology disruption, and market shifts. Higher
                          scores indicate greater vulnerability.
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  {/* Sector Risk Scores */}
                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "1.125rem",
                          color: isDark ? "#FFFFFF" : "#0F172A",
                        }}
                      >
                        Sector Risk Scores
                      </Typography>
                      {!editMode && (
                        <Button
                          size="small"
                          startIcon={<Edit2 size={16} />}
                          onClick={() => setEditMode(true)}
                          sx={{ color: "#FDB913", textTransform: "none" }}
                        >
                          Edit Scores
                        </Button>
                      )}
                      {editMode && (
                        <Button
                          size="small"
                          startIcon={<Save size={16} />}
                          onClick={handleSaveScores}
                          variant="contained"
                          sx={{
                            backgroundColor: "#10B981",
                            color: "#FFFFFF",
                            textTransform: "none",
                            "&:hover": { backgroundColor: "#059669" },
                          }}
                        >
                          Save Changes
                        </Button>
                      )}
                    </Stack>
                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{
                        border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                        borderRadius: 2,
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow
                            sx={{
                              backgroundColor: isDark
                                ? alpha("#1E293B", 0.5)
                                : "#F8FAFC",
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                color: isDark ? "#FFFFFF" : "#0F172A",
                              }}
                            >
                              Sector
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                color: isDark ? "#FFFFFF" : "#0F172A",
                              }}
                              align="center"
                            >
                              Risk Score (0-10)
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                color: isDark ? "#FFFFFF" : "#0F172A",
                              }}
                              align="center"
                            >
                              Risk Level
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(localSectorScores)
                            .sort(([, a], [, b]) => b - a)
                            .map(([sector, score]) => {
                              const risk = getRiskLevel(score);
                              return (
                                <TableRow key={sector} hover>
                                  <TableCell
                                    sx={{
                                      fontWeight: 600,
                                      color: isDark ? "#FFFFFF" : "#0F172A",
                                    }}
                                  >
                                    {sector}
                                  </TableCell>
                                  <TableCell align="center">
                                    {editMode ? (
                                      <TextField
                                        type="number"
                                        size="small"
                                        value={score}
                                        onChange={(e) => {
                                          const newScore = Math.max(
                                            0,
                                            Math.min(
                                              10,
                                              parseFloat(e.target.value) || 0,
                                            ),
                                          );
                                          setLocalSectorScores({
                                            ...localSectorScores,
                                            [sector]: newScore,
                                          });
                                        }}
                                        inputProps={{
                                          min: 0,
                                          max: 10,
                                          step: 0.1,
                                        }}
                                        sx={{ width: 100 }}
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              /10
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    ) : (
                                      <Typography
                                        sx={{
                                          fontWeight: 700,
                                          color: isDark ? "#FFFFFF" : "#0F172A",
                                        }}
                                      >
                                        {score.toFixed(1)}
                                      </Typography>
                                    )}
                                  </TableCell>
                                  <TableCell align="center">
                                    <Chip
                                      label={risk.label}
                                      size="small"
                                      sx={{
                                        backgroundColor: risk.bg,
                                        color: risk.color,
                                        fontWeight: 600,
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>

                  {/* Product Type Risk Scores */}
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.125rem",
                        color: isDark ? "#FFFFFF" : "#0F172A",
                        mb: 2,
                      }}
                    >
                      Product Type Risk Scores
                    </Typography>
                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{
                        border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                        borderRadius: 2,
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow
                            sx={{
                              backgroundColor: isDark
                                ? alpha("#1E293B", 0.5)
                                : "#F8FAFC",
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                color: isDark ? "#FFFFFF" : "#0F172A",
                              }}
                            >
                              Product Type
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                color: isDark ? "#FFFFFF" : "#0F172A",
                              }}
                              align="center"
                            >
                              Risk Score (0-10)
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                color: isDark ? "#FFFFFF" : "#0F172A",
                              }}
                              align="center"
                            >
                              Risk Level
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(localProductScores)
                            .sort(([, a], [, b]) => b - a)
                            .map(([product, score]) => {
                              const risk = getRiskLevel(score);
                              return (
                                <TableRow key={product} hover>
                                  <TableCell
                                    sx={{
                                      fontWeight: 600,
                                      color: isDark ? "#FFFFFF" : "#0F172A",
                                    }}
                                  >
                                    {product}
                                  </TableCell>
                                  <TableCell align="center">
                                    {editMode ? (
                                      <TextField
                                        type="number"
                                        size="small"
                                        value={score}
                                        onChange={(e) => {
                                          const newScore = Math.max(
                                            0,
                                            Math.min(
                                              10,
                                              parseFloat(e.target.value) || 0,
                                            ),
                                          );
                                          setLocalProductScores({
                                            ...localProductScores,
                                            [product]: newScore,
                                          });
                                        }}
                                        inputProps={{
                                          min: 0,
                                          max: 10,
                                          step: 0.1,
                                        }}
                                        sx={{ width: 100 }}
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              /10
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    ) : (
                                      <Typography
                                        sx={{
                                          fontWeight: 700,
                                          color: isDark ? "#FFFFFF" : "#0F172A",
                                        }}
                                      >
                                        {score.toFixed(1)}
                                      </Typography>
                                    )}
                                  </TableCell>
                                  <TableCell align="center">
                                    <Chip
                                      label={risk.label}
                                      size="small"
                                      sx={{
                                        backgroundColor: risk.bg,
                                        color: risk.color,
                                        fontWeight: 600,
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>

                  {/* Run Assessment Button */}
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleRunAssessment}
                      sx={{
                        backgroundColor: "#FDB913",
                        color: "#0F172A",
                        fontWeight: 700,
                        px: 4,
                        "&:hover": {
                          backgroundColor: "#E5A810",
                        },
                      }}
                    >
                      Run Transition Risk Analytics
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </TabPanel>

            {/* Results Tab */}
            <TabPanel value={activeTab} index={1}>
              <Box sx={{ p: 3 }}>
                <Stack spacing={4}>
                  {/* High Risk Exposure Summary */}
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.125rem",
                        color: isDark ? "#FFFFFF" : "#0F172A",
                        mb: 2,
                      }}
                    >
                      High-Risk Sector Exposure
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        backgroundColor: alpha("#DC2626", 0.08),
                        border: `1px solid ${alpha("#DC2626", 0.3)}`,
                        borderRadius: 2,
                        p: 3,
                        mb: 2,
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-around"
                        flexWrap="wrap"
                        spacing={3}
                      >
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            sx={{
                              fontSize: "2.5rem",
                              fontWeight: 800,
                              color: "#DC2626",
                              lineHeight: 1,
                            }}
                          >
                            {highRiskSectors.length}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                              mt: 0.5,
                            }}
                          >
                            High Risk Sectors
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            sx={{
                              fontSize: "2.5rem",
                              fontWeight: 800,
                              color: "#DC2626",
                              lineHeight: 1,
                            }}
                          >
                            {formatCurrency(
                              highRiskSectors.reduce(
                                (sum, s) => sum + s.exposure,
                                0,
                              ),
                            )}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                              mt: 0.5,
                            }}
                          >
                            Total Exposure
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            sx={{
                              fontSize: "2.5rem",
                              fontWeight: 800,
                              color: "#DC2626",
                              lineHeight: 1,
                            }}
                          >
                            {highRiskSectors
                              .reduce((sum, s) => sum + s.assetCount, 0)
                              .toLocaleString()}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                              mt: 0.5,
                            }}
                          >
                            Assets at Risk
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>

                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{
                        border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                        borderRadius: 2,
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow
                            sx={{
                              backgroundColor: isDark
                                ? alpha("#1E293B", 0.5)
                                : "#F8FAFC",
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                color: isDark ? "#FFFFFF" : "#0F172A",
                              }}
                            >
                              Sector
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                color: isDark ? "#FFFFFF" : "#0F172A",
                              }}
                              align="right"
                            >
                              Exposure
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                color: isDark ? "#FFFFFF" : "#0F172A",
                              }}
                              align="right"
                            >
                              Asset Count
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                color: isDark ? "#FFFFFF" : "#0F172A",
                              }}
                              align="center"
                            >
                              Risk Score
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {highRiskSectors.map((sector) => {
                            const risk = getRiskLevel(sector.riskScore);
                            return (
                              <TableRow key={sector.sector} hover>
                                <TableCell
                                  sx={{
                                    fontWeight: 600,
                                    color: isDark ? "#FFFFFF" : "#0F172A",
                                  }}
                                >
                                  {sector.sector}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontWeight: 600,
                                    color: isDark
                                      ? alpha("#FFFFFF", 0.9)
                                      : "#0F172A",
                                  }}
                                >
                                  {formatCurrency(sector.exposure)}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    color: isDark
                                      ? alpha("#FFFFFF", 0.9)
                                      : "#0F172A",
                                  }}
                                >
                                  {sector.assetCount.toLocaleString()}
                                </TableCell>
                                <TableCell align="center">
                                  <Chip
                                    label={`${sector.riskScore}/10`}
                                    size="small"
                                    sx={{
                                      backgroundColor: risk.bg,
                                      color: risk.color,
                                      fontWeight: 700,
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Stack>
              </Box>
            </TabPanel>
          </Paper>
        </Stack>
      </Box>
    </CRALayout>
  );
}
