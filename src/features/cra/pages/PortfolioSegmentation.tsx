import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  alpha,
  useTheme,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import {
  Search,
  Download,
  PieChart as PieChartIcon,
  BarChart2,
  Filter,
  X,
} from "lucide-react";
import { useSegmentationStore, useCRADataStore } from "@/store/craStore";
import CRALayout from "../layout/CRALayout";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Default sectors and regions (used as fallback when no data)
const DEFAULT_SECTORS = [
  "Financial Services",
  "Energy",
  "Technology",
  "Manufacturing",
  "Real Estate",
  "Healthcare",
];

const DEFAULT_REGIONS = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Africa",
  "Middle East",
];

export default function PortfolioSegmentation() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { filters, setFilters } = useSegmentationStore();
  const { assets } = useCRADataStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const allAssetsFlat = useMemo(() => {
    return Object.values(assets).flatMap((assetType) => assetType.data);
  }, [assets]);

  const availableSectorsFromData = useMemo(() => {
    const sectors = new Set(allAssetsFlat.map((a) => a.sector));
    return Array.from(sectors).length > 0
      ? Array.from(sectors)
      : DEFAULT_SECTORS;
  }, [allAssetsFlat]);

  const availableRegionsFromData = useMemo(() => {
    const regions = new Set(allAssetsFlat.map((a) => a.region));
    return Array.from(regions).length > 0
      ? Array.from(regions)
      : DEFAULT_REGIONS;
  }, [allAssetsFlat]);

  const totalExposure = useMemo(() => {
    return allAssetsFlat.reduce(
      (sum, asset) => sum + (asset.outstandingBalance || 0),
      0,
    );
  }, [allAssetsFlat]);

  const totalAssetCount = allAssetsFlat.length;

  const sectorData = useMemo(() => {
    const sectorMap = new Map<string, { count: number; exposure: number }>();
    allAssetsFlat.forEach((asset) => {
      const current = sectorMap.get(asset.sector) || { count: 0, exposure: 0 };
      sectorMap.set(asset.sector, {
        count: current.count + 1,
        exposure: current.exposure + (asset.outstandingBalance || 0),
      });
    });
    return Array.from(sectorMap.entries()).map(([name, data]) => ({
      name,
      value: data.count,
      exposure: data.exposure,
    }));
  }, [allAssetsFlat]);

  const regionData = useMemo(() => {
    const regionMap = new Map<string, { count: number; exposure: number }>();
    allAssetsFlat.forEach((asset) => {
      const current = regionMap.get(asset.region) || { count: 0, exposure: 0 };
      regionMap.set(asset.region, {
        count: current.count + 1,
        exposure: current.exposure + (asset.outstandingBalance || 0),
      });
    });
    return Array.from(regionMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      exposure: data.exposure,
    }));
  }, [allAssetsFlat]);

  const COLORS = [
    "#FDB913",
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EC4899",
    "#8B5CF6",
  ];

  const handleFilterChange = (
    filterType: keyof typeof filters,
    value: string[],
  ) => {
    setFilters({ ...filters, [filterType]: value });
  };

  const handleClearFilter = (
    filterType: keyof typeof filters,
    value: string,
  ) => {
    const current = filters[filterType] as string[];
    handleFilterChange(
      filterType,
      current.filter((v) => v !== value),
    );
  };

  const handleClearAllFilters = () => {
    setFilters({
      sector: [],
      region: [],
    });
  };

  const activeFiltersCount = Object.values(filters).flat().length;

  const filteredAssets = useMemo(() => {
    return allAssetsFlat.filter((asset) => {
      const matchesSector =
        filters.sector.length === 0 || filters.sector.includes(asset.sector);
      const matchesRegion =
        filters.region.length === 0 || filters.region.includes(asset.region);
      return matchesSector && matchesRegion;
    });
  }, [allAssetsFlat, filters]);

  const tableData = useMemo(() => {
    return filteredAssets.slice(0, 100).map((asset, index) => ({
      id: index + 1,
      assetId: asset.id,
      assetType: asset.facilityId || "N/A",
      sector: asset.sector,
      region: asset.region,
      exposure: asset.outstandingBalance || 0,
      riskLevel: asset.status === "Active" ? "Low" : "Medium",
    }));
  }, [filteredAssets]);

  const filteredTableData = tableData.filter((row) => {
    const matchesSearch =
      searchTerm === "" ||
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase()),
      );
    return matchesSearch;
  });

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
      <Box sx={{ display: "flex", height: "100%", overflow: "hidden" }}>
        {/* Left Filter Panel */}
        <Box
          sx={{
            width: 280,
            borderRight: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
            backgroundColor: isDark ? alpha("#0F1623", 0.5) : "#F8FAFC",
            p: 2.5,
            overflowY: "auto",
          }}
        >
          <Stack spacing={2.5}>
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Filter size={18} color="#FDB913" />
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: isDark ? "#FFFFFF" : "#0F172A",
                    }}
                  >
                    Filters
                  </Typography>
                  {activeFiltersCount > 0 && (
                    <Chip
                      label={activeFiltersCount}
                      size="small"
                      sx={{
                        height: 20,
                        backgroundColor: alpha("#FDB913", 0.15),
                        color: "#FDB913",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    />
                  )}
                </Stack>
                {activeFiltersCount > 0 && (
                  <Button
                    size="small"
                    onClick={handleClearAllFilters}
                    sx={{
                      fontSize: "0.75rem",
                      color: "#EF4444",
                      minWidth: "auto",
                      p: 0.5,
                    }}
                  >
                    Clear All
                  </Button>
                )}
              </Stack>
            </Box>

            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontSize: "0.875rem" }}>Sector</InputLabel>
              <Select
                multiple
                value={filters.sector}
                onChange={(e) =>
                  handleFilterChange("sector", e.target.value as string[])
                }
                label="Sector"
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        size="small"
                        sx={{ fontSize: "0.75rem" }}
                        onDelete={(e) => {
                          e.stopPropagation();
                          handleClearFilter("sector", value);
                        }}
                        deleteIcon={<X size={14} />}
                      />
                    ))}
                  </Box>
                )}
              >
                {availableSectorsFromData.map((sector) => (
                  <MenuItem
                    key={sector}
                    value={sector}
                    sx={{ fontSize: "0.875rem" }}
                  >
                    {sector}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontSize: "0.875rem" }}>Region</InputLabel>
              <Select
                multiple
                value={filters.region}
                onChange={(e) =>
                  handleFilterChange("region", e.target.value as string[])
                }
                label="Region"
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        size="small"
                        sx={{ fontSize: "0.75rem" }}
                        onDelete={(e) => {
                          e.stopPropagation();
                          handleClearFilter("region", value);
                        }}
                        deleteIcon={<X size={14} />}
                      />
                    ))}
                  </Box>
                )}
              >
                {availableRegionsFromData.map((region) => (
                  <MenuItem
                    key={region}
                    value={region}
                    sx={{ fontSize: "0.875rem" }}
                  >
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflowY: "auto" }}>
          <Stack spacing={3}>
            {/* Header */}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: isDark ? "#FFFFFF" : "#0F172A",
                  mb: 0.5,
                }}
              >
                Portfolio Segmentation
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  color: isDark ? alpha("#FFFFFF", 0.65) : "#64748B",
                }}
              >
                Analyze portfolio exposure by sector, region, and location
              </Typography>
            </Box>

            {/* Dashboard Widgets */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  minWidth: 200,
                  backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                  border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                  borderRadius: 2,
                  p: 2.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                    mb: 1,
                  }}
                >
                  TOTAL EXPOSURE
                </Typography>
                <Typography
                  sx={{ fontSize: "2rem", fontWeight: 800, color: "#FDB913" }}
                >
                  {formatCurrency(totalExposure)}
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  minWidth: 200,
                  backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                  border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                  borderRadius: 2,
                  p: 2.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                    mb: 1,
                  }}
                >
                  ASSET COUNT
                </Typography>
                <Typography
                  sx={{ fontSize: "2rem", fontWeight: 800, color: "#10B981" }}
                >
                  {totalAssetCount.toLocaleString()}
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  minWidth: 200,
                  backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                  border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                  borderRadius: 2,
                  p: 2.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                    mb: 1,
                  }}
                >
                  SECTORS
                </Typography>
                <Typography
                  sx={{ fontSize: "2rem", fontWeight: 800, color: "#3B82F6" }}
                >
                  {sectorData.length}
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  minWidth: 200,
                  backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                  border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                  borderRadius: 2,
                  p: 2.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                    mb: 1,
                  }}
                >
                  REGIONS
                </Typography>
                <Typography
                  sx={{ fontSize: "2rem", fontWeight: 800, color: "#F59E0B" }}
                >
                  {regionData.length}
                </Typography>
              </Paper>
            </Box>

            {/* Charts */}
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: { xs: "wrap", lg: "nowrap" },
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                  border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                  borderRadius: 2,
                  p: 3,
                  minWidth: { xs: "100%", lg: 0 },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                  <PieChartIcon size={20} color="#FDB913" />
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: isDark ? "#FFFFFF" : "#0F172A",
                    }}
                  >
                    Exposure by Sector
                  </Typography>
                </Stack>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        percent
                          ? `${name}: ${(percent * 100).toFixed(0)}%`
                          : name
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sectorData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                  border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                  borderRadius: 2,
                  p: 3,
                  minWidth: { xs: "100%", lg: 0 },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                  <BarChart2 size={20} color="#FDB913" />
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: isDark ? "#FFFFFF" : "#0F172A",
                    }}
                  >
                    Exposure by Region
                  </Typography>
                </Stack>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDark ? alpha("#334155", 0.3) : "#E2E8F0"}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 11,
                        fill: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                      }}
                    />
                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                      }}
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                    <Legend />
                    <Bar dataKey="exposure" fill="#FDB913" name="Exposure" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Box>

            {/* Segmented Table */}
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
                direction={{ xs: "column", sm: "row" }}
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
                  Segmented Assets
                </Typography>
                <Stack direction="row" spacing={2}>
                  <TextField
                    size="small"
                    placeholder="Search assets..."
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
                        Asset Type
                      </TableCell>
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
                      >
                        Region
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
                      >
                        Risk Level
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTableData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell
                            sx={{
                              color: isDark ? alpha("#FFFFFF", 0.9) : "#0F172A",
                            }}
                          >
                            {row.assetType}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: isDark ? alpha("#FFFFFF", 0.9) : "#0F172A",
                            }}
                          >
                            {row.sector}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: isDark ? alpha("#FFFFFF", 0.9) : "#0F172A",
                            }}
                          >
                            {row.region}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              color: isDark ? alpha("#FFFFFF", 0.9) : "#0F172A",
                              fontWeight: 600,
                            }}
                          >
                            {formatCurrency(row.exposure)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={row.riskLevel}
                              size="small"
                              sx={{
                                backgroundColor:
                                  row.riskLevel === "High"
                                    ? alpha("#EF4444", 0.15)
                                    : row.riskLevel === "Medium"
                                      ? alpha("#F59E0B", 0.15)
                                      : alpha("#10B981", 0.15),
                                color:
                                  row.riskLevel === "High"
                                    ? "#EF4444"
                                    : row.riskLevel === "Medium"
                                      ? "#F59E0B"
                                      : "#10B981",
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filteredTableData.length}
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
      </Box>
    </CRALayout>
  );
}
