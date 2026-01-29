import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  alpha,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Map as MapIcon,
  Search,
  Download,
  AlertTriangle,
  TrendingDown,
  Building2,
} from "lucide-react";
import CRALayout from "../layout/CRALayout";

interface CollateralData {
  id: string;
  loanId: string;
  borrowerName: string;
  collateralType: string;
  location: string;
  region: string;
  physicalRisk: string;
  riskLevel: "High" | "Medium" | "Low";
  estimatedValue: number;
  valueImpact: number;
  latitude: number;
  longitude: number;
}

export default function CollateralSensitivity() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterRiskLevel, setFilterRiskLevel] = useState("all");

  const mockCollateralData: CollateralData[] = [
    {
      id: "C001",
      loanId: "L2024-001",
      borrowerName: "Coastal Properties Ltd",
      collateralType: "Real Estate",
      location: "Lagos Waterfront",
      region: "Lagos",
      physicalRisk: "Flooding, Sea Level Rise",
      riskLevel: "High",
      estimatedValue: 50000000,
      valueImpact: -25,
      latitude: 6.4541,
      longitude: 3.3947,
    },
    {
      id: "C002",
      loanId: "L2024-045",
      borrowerName: "Savannah Agro Holdings",
      collateralType: "Agricultural Land",
      location: "Northern Region",
      region: "Tamale",
      physicalRisk: "Drought, Extreme Heat",
      riskLevel: "High",
      estimatedValue: 35000000,
      valueImpact: -30,
      latitude: 9.4034,
      longitude: -0.8393,
    },
    {
      id: "C003",
      loanId: "L2024-092",
      borrowerName: "Industrial Hub Corp",
      collateralType: "Manufacturing Plant",
      location: "Tema Industrial Area",
      region: "Greater Accra",
      physicalRisk: "Flooding",
      riskLevel: "Medium",
      estimatedValue: 75000000,
      valueImpact: -15,
      latitude: 5.6698,
      longitude: -0.0166,
    },
    {
      id: "C004",
      loanId: "L2024-134",
      borrowerName: "Ashanti Gold Mines",
      collateralType: "Mining Equipment",
      location: "Obuasi",
      region: "Ashanti",
      physicalRisk: "Heatwave",
      riskLevel: "Low",
      estimatedValue: 120000000,
      valueImpact: -5,
      latitude: 6.2051,
      longitude: -1.6776,
    },
    {
      id: "C005",
      loanId: "L2024-178",
      borrowerName: "Port Operations Ltd",
      collateralType: "Port Infrastructure",
      location: "Takoradi Port",
      region: "Western",
      physicalRisk: "Sea Level Rise, Storm",
      riskLevel: "High",
      estimatedValue: 200000000,
      valueImpact: -35,
      latitude: 4.8845,
      longitude: -1.7554,
    },
  ];

  const filteredData = mockCollateralData.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.collateralType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterRiskLevel === "all" || item.riskLevel === filterRiskLevel;

    return matchesSearch && matchesFilter;
  });

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  const totalExposure = mockCollateralData.reduce(
    (sum, item) => sum + item.estimatedValue,
    0,
  );
  const totalValueAtRisk = mockCollateralData.reduce(
    (sum, item) =>
      sum + (item.estimatedValue * Math.abs(item.valueImpact)) / 100,
    0,
  );
  const highRiskCount = mockCollateralData.filter(
    (item) => item.riskLevel === "High",
  ).length;

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
                <MapIcon size={28} color="#FDB913" strokeWidth={2.5} />
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
                  Collateral Sensitivity
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.875rem", md: "1rem" },
                    color: isDark ? alpha("#FFFFFF", 0.65) : "#64748B",
                    mt: 0.5,
                  }}
                >
                  Assess climate impact on collateral values and recovery rates
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <Paper
              elevation={0}
              sx={{
                flex: "1 1 calc(33.333% - 16px)",
                minWidth: 200,
                backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                borderRadius: 2,
                p: 2.5,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                <Building2
                  size={20}
                  color={isDark ? alpha("#FFFFFF", 0.6) : "#64748B"}
                />
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                    textTransform: "uppercase",
                  }}
                >
                  Total Collateral Value
                </Typography>
              </Stack>
              <Typography
                sx={{ fontSize: "2rem", fontWeight: 800, color: "#FDB913" }}
              >
                {formatCurrency(totalExposure)}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                flex: "1 1 calc(33.333% - 16px)",
                minWidth: 200,
                backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                borderRadius: 2,
                p: 2.5,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                <TrendingDown size={20} color="#EF4444" />
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                    textTransform: "uppercase",
                  }}
                >
                  Value at Risk
                </Typography>
              </Stack>
              <Typography
                sx={{ fontSize: "2rem", fontWeight: 800, color: "#EF4444" }}
              >
                {formatCurrency(totalValueAtRisk)}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                flex: "1 1 calc(33.333% - 16px)",
                minWidth: 200,
                backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                borderRadius: 2,
                p: 2.5,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                <AlertTriangle size={20} color="#EF4444" />
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                    textTransform: "uppercase",
                  }}
                >
                  High Risk Collateral
                </Typography>
              </Stack>
              <Typography
                sx={{ fontSize: "2rem", fontWeight: 800, color: "#EF4444" }}
              >
                {highRiskCount}
              </Typography>
            </Paper>
          </Box>

          <Paper
            elevation={0}
            sx={{
              backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
              border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
              borderRadius: 2,
              p: 3,
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              mb={3}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  color: isDark ? "#FFFFFF" : "#0F172A",
                }}
              >
                Collateral Risk Analysis
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <TextField
                  size="small"
                  placeholder="Search collateral..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search
                          size={18}
                          color={isDark ? "#64748B" : "#94A3B8"}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 250 }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Risk Level</InputLabel>
                  <Select
                    value={filterRiskLevel}
                    onChange={(e) => setFilterRiskLevel(e.target.value)}
                    label="Risk Level"
                  >
                    <MenuItem value="all">All Levels</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  startIcon={<Download size={18} />}
                  sx={{
                    borderColor: "#FDB913",
                    color: "#FDB913",
                    "&:hover": {
                      borderColor: "#FDB913",
                      backgroundColor: alpha("#FDB913", 0.08),
                    },
                  }}
                >
                  Export
                </Button>
              </Stack>
            </Stack>

            <TableContainer>
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
                      Loan ID
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: isDark ? "#FFFFFF" : "#0F172A",
                      }}
                    >
                      Borrower
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: isDark ? "#FFFFFF" : "#0F172A",
                      }}
                    >
                      Collateral Type
                    </TableCell>
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
                    >
                      Physical Risk
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: isDark ? "#FFFFFF" : "#0F172A",
                      }}
                      align="right"
                    >
                      Estimated Value
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: isDark ? "#FFFFFF" : "#0F172A",
                      }}
                      align="center"
                    >
                      Value Impact
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
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const risk = getRiskColor(row.riskLevel);
                      return (
                        <TableRow key={row.id} hover sx={{ cursor: "pointer" }}>
                          <TableCell sx={{ fontWeight: 600, color: "#FDB913" }}>
                            {row.loanId}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: isDark ? alpha("#FFFFFF", 0.9) : "#0F172A",
                            }}
                          >
                            {row.borrowerName}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: isDark ? alpha("#FFFFFF", 0.9) : "#0F172A",
                            }}
                          >
                            {row.collateralType}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: isDark ? alpha("#FFFFFF", 0.9) : "#0F172A",
                            }}
                          >
                            {row.location}, {row.region}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "0.875rem",
                              color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                            }}
                          >
                            {row.physicalRisk}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              fontWeight: 600,
                              color: isDark ? alpha("#FFFFFF", 0.9) : "#0F172A",
                            }}
                          >
                            {formatCurrency(row.estimatedValue)}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`${row.valueImpact}%`}
                              size="small"
                              icon={<TrendingDown size={14} />}
                              sx={{
                                backgroundColor: alpha("#EF4444", 0.15),
                                color: "#EF4444",
                                fontWeight: 700,
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={row.riskLevel}
                              size="small"
                              sx={{
                                backgroundColor: risk.bg,
                                color: risk.text,
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
            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </Paper>
        </Stack>
      </Box>
    </CRALayout>
  );
}
