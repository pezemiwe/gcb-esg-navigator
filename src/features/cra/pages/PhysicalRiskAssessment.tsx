import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  RadioGroup,
  Radio,
  alpha,
  useTheme,
  Tabs,
  Tab,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Map,
  Settings,
  TrendingUp,
  AlertTriangle,
  Zap,
  Droplet,
  Wind,
  Flame,
  Activity,
} from "lucide-react";
import { usePRARiskStore, useCRAStatusStore } from "@/store/craStore";
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

export default function PhysicalRiskAssessment() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [activeTab, setActiveTab] = useState(0);
  const { selectedRisks, mappingMethod, setSelectedRisks, setMappingMethod } =
    usePRARiskStore();
  const { praReady, setPRAReady } = useCRAStatusStore();

  const availableRisks = [
    {
      id: "flooding",
      label: "Flooding",
      icon: <Droplet size={18} />,
      color: "#3B82F6",
    },
    {
      id: "wildfire",
      label: "Wildfire",
      icon: <Flame size={18} />,
      color: "#EF4444",
    },
    {
      id: "hurricane",
      label: "Hurricane/Cyclone",
      icon: <Wind size={18} />,
      color: "#64748B",
    },
    {
      id: "drought",
      label: "Drought",
      icon: <AlertTriangle size={18} />,
      color: "#F59E0B",
    },
    {
      id: "heatwave",
      label: "Extreme Heat",
      icon: <Zap size={18} />,
      color: "#EC4899",
    },
    {
      id: "sea_level",
      label: "Sea Level Rise",
      icon: <Activity size={18} />,
      color: "#10B981",
    },
  ];

  const mappingMethods = [
    {
      id: "gps",
      label: "GPS Coordinates",
      description: "Use latitude/longitude data from asset records",
    },
    {
      id: "geocoding",
      label: "Address Geocoding",
      description: "Convert addresses to coordinates automatically",
    },
    {
      id: "regional",
      label: "Regional Aggregation",
      description: "Group assets by admin regions (city/state/country)",
    },
  ];

  const handleRiskToggle = (riskId: string) => {
    if (selectedRisks.includes(riskId)) {
      setSelectedRisks(selectedRisks.filter((r) => r !== riskId));
    } else {
      setSelectedRisks([...selectedRisks, riskId]);
    }
  };

  const handleRunAssessment = () => {
    // Mock: Set PRA as ready
    setPRAReady(true);
    setActiveTab(1); // Switch to Results tab
  };

  // Mock risk matrix data
  const riskMatrixData = [
    {
      region: "North America",
      flooding: "High",
      wildfire: "Medium",
      hurricane: "Low",
      drought: "Medium",
      heatwave: "High",
      sea_level: "Medium",
    },
    {
      region: "Europe",
      flooding: "Medium",
      wildfire: "Low",
      hurricane: "Low",
      drought: "Low",
      heatwave: "Medium",
      sea_level: "High",
    },
    {
      region: "Asia Pacific",
      flooding: "High",
      wildfire: "Medium",
      hurricane: "High",
      drought: "Medium",
      heatwave: "High",
      sea_level: "High",
    },
    {
      region: "Africa",
      flooding: "Medium",
      wildfire: "High",
      hurricane: "Low",
      drought: "High",
      heatwave: "High",
      sea_level: "Low",
    },
    {
      region: "Middle East",
      flooding: "Low",
      wildfire: "Medium",
      hurricane: "Low",
      drought: "High",
      heatwave: "High",
      sea_level: "Medium",
    },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High":
        return { bg: alpha("#EF4444", 0.15), text: "#EF4444" };
      case "Medium":
        return { bg: alpha("#F59E0B", 0.15), text: "#F59E0B" };
      case "Low":
        return { bg: alpha("#10B981", 0.15), text: "#10B981" };
      default:
        return { bg: alpha("#64748B", 0.15), text: "#64748B" };
    }
  };

  // Mock heatmap-style data for individual risks
  const floodingHotspots = [
    {
      location: "New York",
      assetCount: 245,
      exposureUSD: 450000000,
      riskScore: 8.5,
    },
    {
      location: "Miami",
      assetCount: 189,
      exposureUSD: 320000000,
      riskScore: 9.2,
    },
    {
      location: "Houston",
      assetCount: 167,
      exposureUSD: 280000000,
      riskScore: 7.8,
    },
    {
      location: "New Orleans",
      assetCount: 134,
      exposureUSD: 220000000,
      riskScore: 9.5,
    },
  ];

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
                <Map size={28} color="#FDB913" strokeWidth={2.5} />
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
                  Physical Risk Mapping
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.875rem", md: "1rem" },
                    color: isDark ? alpha("#FFFFFF", 0.65) : "#64748B",
                    mt: 0.5,
                  }}
                >
                  Map geographic exposure to climate hazards and natural
                  disasters
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
                label="Setup & Configuration"
              />
              <Tab
                icon={<TrendingUp size={18} />}
                iconPosition="start"
                label="Risk Results"
                disabled={!praReady && selectedRisks.length === 0}
              />
            </Tabs>

            {/* Setup Tab */}
            <TabPanel value={activeTab} index={0}>
              <Box sx={{ p: 3 }}>
                <Stack spacing={4}>
                  {/* Select Risks */}
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.125rem",
                        color: isDark ? "#FFFFFF" : "#0F172A",
                        mb: 2,
                      }}
                    >
                      Select Climate Hazards to Assess
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        backgroundColor: isDark
                          ? alpha("#1E293B", 0.5)
                          : "#F8FAFC",
                        border: `1px solid ${isDark ? alpha("#334155", 0.3) : "#E2E8F0"}`,
                        borderRadius: 2,
                        p: 3,
                      }}
                    >
                      <FormGroup>
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: {
                              xs: "1fr",
                              md: "repeat(2, 1fr)",
                            },
                            gap: 2,
                          }}
                        >
                          {availableRisks.map((risk) => (
                            <FormControlLabel
                              key={risk.id}
                              control={
                                <Checkbox
                                  checked={selectedRisks.includes(risk.id)}
                                  onChange={() => handleRiskToggle(risk.id)}
                                  sx={{
                                    color: risk.color,
                                    "&.Mui-checked": {
                                      color: risk.color,
                                    },
                                  }}
                                />
                              }
                              label={
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <Box
                                    sx={{ color: risk.color, display: "flex" }}
                                  >
                                    {risk.icon}
                                  </Box>
                                  <Typography
                                    sx={{
                                      fontWeight: 600,
                                      color: isDark ? "#FFFFFF" : "#0F172A",
                                    }}
                                  >
                                    {risk.label}
                                  </Typography>
                                </Stack>
                              }
                            />
                          ))}
                        </Box>
                      </FormGroup>
                    </Paper>
                  </Box>

                  {/* Mapping Method */}
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.125rem",
                        color: isDark ? "#FFFFFF" : "#0F172A",
                        mb: 2,
                      }}
                    >
                      Choose Mapping Method
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        backgroundColor: isDark
                          ? alpha("#1E293B", 0.5)
                          : "#F8FAFC",
                        border: `1px solid ${isDark ? alpha("#334155", 0.3) : "#E2E8F0"}`,
                        borderRadius: 2,
                        p: 3,
                      }}
                    >
                      <RadioGroup
                        value={mappingMethod}
                        onChange={(e) => setMappingMethod(e.target.value)}
                      >
                        <Stack spacing={2}>
                          {mappingMethods.map((method) => (
                            <Paper
                              key={method.id}
                              elevation={0}
                              sx={{
                                border: `2px solid ${mappingMethod === method.id ? "#FDB913" : isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                                borderRadius: 2,
                                p: 2,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  borderColor: "#FDB913",
                                },
                              }}
                              onClick={() => setMappingMethod(method.id)}
                            >
                              <FormControlLabel
                                value={method.id}
                                control={
                                  <Radio
                                    sx={{
                                      color: "#FDB913",
                                      "&.Mui-checked": {
                                        color: "#FDB913",
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <Box>
                                    <Typography
                                      sx={{
                                        fontWeight: 700,
                                        color: isDark ? "#FFFFFF" : "#0F172A",
                                        mb: 0.5,
                                      }}
                                    >
                                      {method.label}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: "0.875rem",
                                        color: isDark
                                          ? alpha("#FFFFFF", 0.7)
                                          : "#64748B",
                                      }}
                                    >
                                      {method.description}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </Paper>
                          ))}
                        </Stack>
                      </RadioGroup>
                    </Paper>
                  </Box>

                  {/* Run Assessment Button */}
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      size="large"
                      disabled={selectedRisks.length === 0 || !mappingMethod}
                      onClick={handleRunAssessment}
                      sx={{
                        backgroundColor: "#FDB913",
                        color: "#0F172A",
                        fontWeight: 700,
                        px: 4,
                        "&:hover": {
                          backgroundColor: "#E5A810",
                        },
                        "&:disabled": {
                          backgroundColor: isDark
                            ? alpha("#334155", 0.3)
                            : "#E2E8F0",
                          color: isDark ? alpha("#FFFFFF", 0.3) : "#94A3B8",
                        },
                      }}
                    >
                      Run Physical Risk Mapping
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </TabPanel>

            {/* Results Tab */}
            <TabPanel value={activeTab} index={1}>
              <Box sx={{ p: 3 }}>
                <Stack spacing={4}>
                  {/* Selected Risks Summary */}
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.125rem",
                        color: isDark ? "#FFFFFF" : "#0F172A",
                        mb: 2,
                      }}
                    >
                      Assessment Summary
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {selectedRisks.map((riskId) => {
                        const risk = availableRisks.find(
                          (r) => r.id === riskId,
                        );
                        return risk ? (
                          <Chip
                            key={riskId}
                            icon={risk.icon}
                            label={risk.label}
                            sx={{
                              backgroundColor: alpha(risk.color, 0.15),
                              color: risk.color,
                              fontWeight: 600,
                              border: `1px solid ${alpha(risk.color, 0.3)}`,
                            }}
                          />
                        ) : null;
                      })}
                    </Stack>
                  </Box>

                  {/* Risk Matrix */}
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.125rem",
                        color: isDark ? "#FFFFFF" : "#0F172A",
                        mb: 2,
                      }}
                    >
                      Regional Risk Matrix
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
                              Region
                            </TableCell>
                            {selectedRisks.map((riskId) => {
                              const risk = availableRisks.find(
                                (r) => r.id === riskId,
                              );
                              return risk ? (
                                <TableCell
                                  key={riskId}
                                  sx={{
                                    fontWeight: 700,
                                    color: isDark ? "#FFFFFF" : "#0F172A",
                                  }}
                                >
                                  {risk.label}
                                </TableCell>
                              ) : null;
                            })}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {riskMatrixData.map((row) => (
                            <TableRow key={row.region} hover>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  color: isDark ? "#FFFFFF" : "#0F172A",
                                }}
                              >
                                {row.region}
                              </TableCell>
                              {selectedRisks.map((riskId) => {
                                const level = row[
                                  riskId as keyof typeof row
                                ] as string;
                                const colors = getRiskColor(level);
                                return (
                                  <TableCell key={riskId}>
                                    <Chip
                                      label={level}
                                      size="small"
                                      sx={{
                                        backgroundColor: colors.bg,
                                        color: colors.text,
                                        fontWeight: 600,
                                      }}
                                    />
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>

                  {/* Individual Risk Heatmaps (Example: Flooding) */}
                  {selectedRisks.includes("flooding") && (
                    <Box>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        mb={2}
                      >
                        <Droplet size={20} color="#3B82F6" />
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: "1.125rem",
                            color: isDark ? "#FFFFFF" : "#0F172A",
                          }}
                        >
                          Flooding Risk Hotspots
                        </Typography>
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
                                Location
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
                                align="right"
                              >
                                Exposure (USD)
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
                            {floodingHotspots.map((hotspot) => {
                              const riskLevel =
                                hotspot.riskScore >= 9
                                  ? "High"
                                  : hotspot.riskScore >= 7
                                    ? "Medium"
                                    : "Low";
                              const colors = getRiskColor(riskLevel);
                              return (
                                <TableRow key={hotspot.location} hover>
                                  <TableCell
                                    sx={{
                                      fontWeight: 600,
                                      color: isDark ? "#FFFFFF" : "#0F172A",
                                    }}
                                  >
                                    {hotspot.location}
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{
                                      color: isDark
                                        ? alpha("#FFFFFF", 0.9)
                                        : "#0F172A",
                                    }}
                                  >
                                    {hotspot.assetCount.toLocaleString()}
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{
                                      color: isDark
                                        ? alpha("#FFFFFF", 0.9)
                                        : "#0F172A",
                                      fontWeight: 600,
                                    }}
                                  >
                                    $
                                    {(hotspot.exposureUSD / 1000000).toFixed(1)}
                                    M
                                  </TableCell>
                                  <TableCell align="center">
                                    <Chip
                                      label={`${hotspot.riskScore}/10`}
                                      size="small"
                                      sx={{
                                        backgroundColor: colors.bg,
                                        color: colors.text,
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
                  )}
                </Stack>
              </Box>
            </TabPanel>
          </Paper>
        </Stack>
      </Box>
    </CRALayout>
  );
}
