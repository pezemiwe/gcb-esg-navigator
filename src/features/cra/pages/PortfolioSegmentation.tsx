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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  Grid,
} from "@mui/material";
import {
  Search,
  Download,
  PieChart as PieChartIcon,
  BarChart2,
  Filter,
  X,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Eye,
  FileSpreadsheet,
  Database,
  Save,
  Layers,
  Table as TableIcon,
  Layout,
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
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
} from "recharts";

// Ghana-specific data
const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "Brong Ahafo",
  "Savannah",
  "North East",
  "Oti",
  "Ahafo",
  "Western North",
];

const SECTORS = [
  "Agriculture",
  "Manufacturing",
  "Construction",
  "Trade/Commerce",
  "Financial Services",
  "Services",
  "Transport & Storage",
  "Mining & Quarrying",
  "Utilities",
  "Real Estate",
];

const ASSET_TYPES = [
  "Loans & Advances",
  "Equity Securities",
  "Fixed Income Securities",
  "Derivative Instruments",
  "Off-Balance Sheet",
];

// Used in type annotation for dataQualityCalc
interface DataQuality {
  totalRecords: number;
  missingSector: number;
  missingRegion: number;
  missingExposure: number;
  invalidDates: number;
  duplicates: number;
  completeness: number;
  issues: string[];
}

interface AssetDetail {
  id?: string;
  name?: string;
  sector?: string;
  region?: string;
  exposure?: number;
  status?: string;
}

interface SelectedSegment {
  type: string;
  value: string | AssetDetail;
}

export default function PortfolioSegmentation() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { filters, setFilters, saveSegment, groupingMode, setGroupingMode } =
    useSegmentationStore();
  const { assets } = useCRADataStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedSegment, setSelectedSegment] =
    useState<SelectedSegment | null>(null);
  const [showDrilldown, setShowDrilldown] = useState(false);
  const [portfolioFilter, setPortfolioFilter] = useState("All");
  const [timeRange, setTimeRange] = useState("1Y");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [segmentDescription, setSegmentDescription] = useState("");

  // Fetch all assets from store
  const allAssetsFlat = useMemo(() => {
    return Object.values(assets).flatMap((assetType) => assetType.data || []);
  }, [assets]);

  // Data validation and quality checks
  const dataQualityCalc: DataQuality | null = useMemo(() => {
    if (allAssetsFlat.length === 0) {
      return null;
    }

    const totalRecords = allAssetsFlat.length;
    const missingSector = allAssetsFlat.filter(
      (a) => !a.sector || a.sector.trim() === "",
    ).length;
    const missingRegion = allAssetsFlat.filter(
      (a) => !a.region || a.region.trim() === "",
    ).length;
    const missingExposure = allAssetsFlat.filter(
      (a) => !a.outstandingBalance && a.outstandingBalance !== 0,
    ).length;
    const invalidDates = allAssetsFlat.filter(
      (a) =>
        a.maturityDate && isNaN(new Date(a.maturityDate as string).getTime()),
    ).length;

    // Check for duplicate IDs
    const ids = allAssetsFlat.map((a) => a.id);
    const duplicates = ids.length - new Set(ids).size;

    const completeness =
      ((totalRecords - missingSector - missingRegion - missingExposure) /
        (totalRecords * 3)) *
      100;

    return {
      totalRecords,
      missingSector,
      missingRegion,
      missingExposure,
      invalidDates,
      duplicates,
      completeness: Math.round(completeness * 100) / 100,
      issues: [
        ...(missingSector > 0
          ? [`${missingSector} records missing sector classification`]
          : []),
        ...(missingRegion > 0
          ? [`${missingRegion} records missing region`]
          : []),
        ...(missingExposure > 0
          ? [`${missingExposure} records missing exposure amount`]
          : []),
        ...(invalidDates > 0
          ? [`${invalidDates} records have invalid dates`]
          : []),
        ...(duplicates > 0 ? [`${duplicates} duplicate records found`] : []),
      ],
    };
  }, [allAssetsFlat]);

  // Available options from data
  const availableSectors = useMemo(() => {
    const sectors = [
      ...new Set(allAssetsFlat.map((a) => a.sector).filter(Boolean)),
    ];
    return sectors.length > 0 ? sectors : SECTORS;
  }, [allAssetsFlat]);

  const availableRegions = useMemo(() => {
    const regions = [
      ...new Set(allAssetsFlat.map((a) => a.region).filter(Boolean)),
    ];
    return regions.length > 0 ? regions : GHANA_REGIONS;
  }, [allAssetsFlat]);

  // Portfolio overview calculations
  const totalExposure = useMemo(() => {
    return allAssetsFlat.reduce(
      (sum, asset) => sum + (Number(asset.outstandingBalance) || 0),
      0,
    );
  }, [allAssetsFlat]);

  const totalAssetCount = allAssetsFlat.length;

  // Apply filters
  const filteredAssets = useMemo(() => {
    let result = allAssetsFlat;

    // Apply portfolio type filter
    if (portfolioFilter !== "All") {
      result = result.filter((asset) => {
        const assetTypeName = ASSET_TYPES.find((type) =>
          type
            .toLowerCase()
            .includes(String(asset.id).split("-")[0].toLowerCase() || ""),
        );
        return assetTypeName === portfolioFilter;
      });
    }

    // Apply other filters
    if (filters.sector.length > 0) {
      result = result.filter((asset) => filters.sector.includes(asset.sector));
    }
    if (filters.region.length > 0) {
      result = result.filter((asset) => filters.region.includes(asset.region));
    }

    return result;
  }, [allAssetsFlat, filters, portfolioFilter]);

  // Sector data for charts
  const sectorData = useMemo(() => {
    const sectorMap = new Map();
    filteredAssets.forEach((asset) => {
      const sector = asset.sector || "Unclassified";
      const current = sectorMap.get(sector) || { count: 0, exposure: 0 };
      sectorMap.set(sector, {
        count: current.count + 1,
        exposure: current.exposure + (Number(asset.outstandingBalance) || 0),
      });
    });
    return Array.from(sectorMap.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        exposure: data.exposure,
        percentage: (data.exposure / totalExposure) * 100,
      }))
      .sort((a, b) => b.exposure - a.exposure);
  }, [filteredAssets, totalExposure]);

  // Region data for charts
  const regionData = useMemo(() => {
    const regionMap = new Map();
    filteredAssets.forEach((asset) => {
      const region = asset.region || "Unclassified";
      const current = regionMap.get(region) || { count: 0, exposure: 0 };
      regionMap.set(region, {
        count: current.count + 1,
        exposure: current.exposure + (Number(asset.outstandingBalance) || 0),
      });
    });
    return Array.from(regionMap.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        exposure: data.exposure,
      }))
      .sort((a, b) => b.exposure - a.exposure)
      .slice(0, 10); // Top 10 regions
  }, [filteredAssets]);

  // Time series data (generate once on mount)
  const [timeSeriesData] = useState(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.map((month) => ({
      month,
      exposure: totalExposure * (0.8 + Math.random() * 0.4),
      count: Math.floor(totalAssetCount * (0.7 + Math.random() * 0.6)),
    }));
  });

  // Top 5 exposures
  const topExposures = useMemo(() => {
    return filteredAssets
      .sort(
        (a, b) =>
          (Number(b.outstandingBalance) || 0) -
          (Number(a.outstandingBalance) || 0),
      )
      .slice(0, 5)
      .map((asset) => ({
        name: asset.borrowerName || asset.id,
        exposure: Number(asset.outstandingBalance) || 0,
        sector: asset.sector,
        region: asset.region,
      }));
  }, [filteredAssets]);

  // Table data
  const tableData = useMemo(() => {
    return filteredAssets.map((asset, index) => ({
      id: asset.id || `ASSET-${index + 1}`,
      name: asset.borrowerName || `Asset ${index + 1}`,
      sector: asset.sector || "N/A",
      region: asset.region || "N/A",
      exposure: Number(asset.outstandingBalance) || 0,
      status: asset.status || "Active",
    }));
  }, [filteredAssets]);

  // Grouped table data for aggregation view
  const groupedTableData = useMemo(() => {
    if (groupingMode === "none") return null;

    const groupedMap = new Map<
      string,
      { count: number; exposure: number; avgTenor: number }
    >();
    filteredAssets.forEach((asset) => {
      let groupKey = "Unknown";
      if (groupingMode === "location") groupKey = asset.region || "Unknown";
      else if (groupingMode === "sector") groupKey = asset.sector || "Unknown";
      else if (groupingMode === "borrower")
        groupKey = asset.borrowerName || "Unknown";

      const current = groupedMap.get(groupKey) || {
        count: 0,
        exposure: 0,
        avgTenor: 0,
      };
      groupedMap.set(groupKey, {
        count: current.count + 1,
        exposure: current.exposure + (Number(asset.outstandingBalance) || 0),
        avgTenor: current.avgTenor, // Could calculate if tenor data available
      });
    });

    return Array.from(groupedMap.entries())
      .map(([group, data]) => ({
        group,
        count: data.count,
        exposure: data.exposure,
        avgTenor: data.avgTenor || "N/A",
      }))
      .sort((a, b) => b.exposure - a.exposure);
  }, [filteredAssets, groupingMode]);

  // Search filtered data
  const filteredTableData = useMemo(() => {
    return tableData.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [tableData, searchTerm]);

  // Handle Save Segment
  const handleSaveSegment = () => {
    if (segmentName.trim()) {
      saveSegment(segmentName, segmentDescription, filteredAssets);
      setShowSaveDialog(false);
      setSegmentName("");
      setSegmentDescription("");
    }
  };

  // Chart colors
  const COLORS = [
    "#FDB913",
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EC4899",
    "#8B5CF6",
    "#EF4444",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#8B5CF6",
    "#EC4899",
  ];

  // Handlers
  const handleFilterChange = (filterType: string, value: string | string[]) => {
    const valueArray = Array.isArray(value) ? value : [value];
    setFilters({ ...filters, [filterType]: valueArray });
  };

  const handleClearAllFilters = () => {
    setFilters({ sector: [], region: [], location: [] });
    setPortfolioFilter("All");
  };

  const handleSectorClick = (sector: string) => {
    setSelectedSegment({ type: "sector", value: sector });
    setFilters({ ...filters, sector: [sector] });
  };

  const handleRegionClick = (region: string) => {
    setSelectedSegment({ type: "region", value: region });
    setFilters({ ...filters, region: [region] });
  };

  const handleDrilldown = (segment: SelectedSegment) => {
    setSelectedSegment(segment);
    setShowDrilldown(true);
  };

  const handleExport = () => {
    const csv = [
      Object.keys(tableData[0] || {}).join(","),
      ...tableData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio_segmentation_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const activeFiltersCount =
    Object.values(filters).flat().length + (portfolioFilter !== "All" ? 1 : 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatShortCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      notation: "compact",
      compactDisplay: "short",
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <CRALayout>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: isDark ? "#0A0E1A" : "#F8FAFC",
          py: 4,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
          <Stack spacing={4}>
            {/* Header - World Bank Style */}
            <Box
              sx={{
                borderBottom: `1px solid ${isDark ? alpha("#94A3B8", 0.2) : alpha("#94A3B8", 0.2)}`,
                pb: 3,
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: "#FDB913",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  letterSpacing: 2,
                  display: "block",
                  mb: 1,
                }}
              >
                CLIMATE RISK ASSESSMENT
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  color: isDark ? "#FFFFFF" : "#1e293b",
                  mb: 1,
                  fontFamily: "'Playfair Display', serif, system-ui", // Optional: if font available, else falls back
                }}
              >
                Portfolio Segmentation
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.05rem",
                  maxWidth: "800px",
                  color: isDark ? alpha("#FFFFFF", 0.7) : "#475569",
                  lineHeight: 1.6,
                }}
              >
                Comprehensive analysis of portfolio exposure across economic
                sectors and geographical regions.
              </Typography>
            </Box>

            {/* Top Alert Banner - Data Quality Issues */}
            {dataQualityCalc && dataQualityCalc.issues.length > 0 && (
              <Alert
                severity={
                  dataQualityCalc.completeness >= 90
                    ? "info"
                    : dataQualityCalc.completeness >= 70
                      ? "warning"
                      : "error"
                }
                icon={<AlertTriangle size={20} />}
                sx={{
                  backgroundColor: isDark ? alpha("#0F1623", 0.8) : "#FFFFFF",
                  border: `1px solid ${
                    dataQualityCalc.completeness >= 90
                      ? alpha("#3B82F6", 0.3)
                      : dataQualityCalc.completeness >= 70
                        ? alpha("#F59E0B", 0.3)
                        : alpha("#EF4444", 0.3)
                  }`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Data Quality Issues Detected:{" "}
                    {dataQualityCalc.missingRegion} records have missing region
                    {dataQualityCalc.invalidDates > 0 &&
                      `, ${dataQualityCalc.invalidDates} have invalid dates`}
                    {dataQualityCalc.duplicates > 0 &&
                      `, ${dataQualityCalc.duplicates} duplicates found`}
                  </Typography>
                </Box>
              </Alert>
            )}

            {/* Empty State - Shows if no data */}
            {allAssetsFlat.length === 0 && (
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                  border: `2px dashed ${isDark ? alpha("#334155", 0.5) : "#CBD5E1"}`,
                  borderRadius: 2.5,
                  p: 8,
                  textAlign: "center",
                }}
              >
                <Stack spacing={3} alignItems="center">
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: alpha("#FDB913", 0.12),
                      borderRadius: "50%",
                      display: "flex",
                    }}
                  >
                    <Database size={56} color="#FDB913" strokeWidth={1.5} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: isDark ? "#FFFFFF" : "#0F172A",
                        mb: 1.5,
                      }}
                    >
                      No Portfolio Data Available
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        color: isDark ? alpha("#FFFFFF", 0.65) : "#64748B",
                        maxWidth: 500,
                        mx: "auto",
                        lineHeight: 1.6,
                      }}
                    >
                      Upload your portfolio data files through the Data Upload
                      page to start analyzing and segmenting your assets for
                      climate risk assessment.
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<FileSpreadsheet size={18} />}
                      onClick={() => (window.location.href = "/cra/data")}
                      sx={{
                        backgroundColor: "#FDB913",
                        color: "#0F172A",
                        fontSize: "0.9375rem",
                        fontWeight: 700,
                        px: 3,
                        py: 1.5,
                        borderRadius: 1.5,
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#F59E0B",
                        },
                      }}
                    >
                      Go to Data Upload
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            )}

            {/* Only show rest of content if data exists */}
            {allAssetsFlat.length > 0 && (
              <>
                {/* Data Quality Banner - World Bank Style */}
                {dataQualityCalc && (
                  <Paper
                    elevation={0}
                    sx={{
                      backgroundColor: isDark
                        ? alpha("#FDB913", 0.05)
                        : "#FFF9E6",
                      border: `1px solid ${alpha("#FDB913", 0.3)}`,
                      borderRadius: 2,
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          p: 1,
                          backgroundColor: "#FDB913",
                          borderRadius: "50%",
                          color: "#1F2937",
                          display: "flex",
                        }}
                      >
                        <AlertTriangle size={20} />
                      </Box>
                      <Box>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color="text.primary"
                          >
                            Dataset Health Check
                          </Typography>
                          <Chip
                            label={`${dataQualityCalc.completeness}% Complete`}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              backgroundColor:
                                dataQualityCalc.completeness >= 90
                                  ? "#10B981"
                                  : dataQualityCalc.completeness >= 70
                                    ? "#F59E0B"
                                    : "#EF4444",
                              color: "#FFF",
                            }}
                          />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {dataQualityCalc.issues.length === 0
                            ? "All critical data points are present."
                            : `${dataQualityCalc.issues.length} potential issues detected in ${dataQualityCalc.totalRecords.toLocaleString()} records.`}
                        </Typography>
                      </Box>
                    </Stack>

                    {dataQualityCalc.issues.length > 0 && (
                      <Stack
                        direction="row"
                        spacing={3}
                        alignItems="center"
                        sx={{ display: { xs: "none", md: "flex" } }}
                      >
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Missing Sector
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            color={
                              dataQualityCalc.missingSector > 0
                                ? "error.main"
                                : "text.primary"
                            }
                          >
                            {dataQualityCalc.missingSector}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: 1,
                            height: 24,
                            backgroundColor: "divider",
                          }}
                        />
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Missing Region
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            color={
                              dataQualityCalc.missingRegion > 0
                                ? "error.main"
                                : "text.primary"
                            }
                          >
                            {dataQualityCalc.missingRegion}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: 1,
                            height: 24,
                            backgroundColor: "divider",
                          }}
                        />
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Missing Exposure
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            color={
                              dataQualityCalc.missingExposure > 0
                                ? "error.main"
                                : "text.primary"
                            }
                          >
                            {dataQualityCalc.missingExposure}
                          </Typography>
                        </Box>
                      </Stack>
                    )}
                  </Paper>
                )}

                {/* Filters - World Bank Style Control Bar */}
                <Paper
                  elevation={0}
                  sx={{
                    backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                    border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                    borderRadius: 2,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    borderLeft: "4px solid #FDB913",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    alignItems={{ xs: "flex-start", md: "center" }}
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box
                        sx={{
                          p: 1,
                          backgroundColor: alpha("#FDB913", 0.1),
                          borderRadius: 1,
                        }}
                      >
                        <Filter size={18} color="#FDB913" />
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          color="text.primary"
                        >
                          Filter Analysis
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activeFiltersCount} active filters
                        </Typography>
                      </Box>
                    </Stack>

                    {activeFiltersCount > 0 && (
                      <Button
                        size="small"
                        onClick={handleClearAllFilters}
                        startIcon={<X size={14} />}
                        sx={{
                          fontSize: "0.75rem",
                          color: "#EF4444",
                          borderColor: alpha("#EF4444", 0.3),
                          "&:hover": {
                            backgroundColor: alpha("#EF4444", 0.08),
                            borderColor: "#EF4444",
                          },
                        }}
                        variant="outlined"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </Stack>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "repeat(1, 1fr)",
                        md: "repeat(3, 1fr)",
                      },
                      gap: 2,
                    }}
                  >
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontSize: "0.875rem" }}>
                        Portfolio Type
                      </InputLabel>
                      <Select
                        value={portfolioFilter}
                        onChange={(e) => setPortfolioFilter(e.target.value)}
                        label="Portfolio Type"
                        sx={{ fontSize: "0.875rem" }}
                      >
                        <MenuItem value="All">All Portfolio Types</MenuItem>
                        {ASSET_TYPES.map((type) => (
                          <MenuItem
                            key={type}
                            value={type}
                            sx={{ fontSize: "0.875rem" }}
                          >
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontSize: "0.875rem" }}>
                        Region
                      </InputLabel>
                      <Select
                        multiple
                        value={filters.region || []}
                        onChange={(e) =>
                          handleFilterChange("region", e.target.value)
                        }
                        label="Region"
                        sx={{ fontSize: "0.875rem" }}
                        renderValue={(selected) =>
                          selected.length > 2
                            ? `${selected.length} Selected`
                            : selected.join(", ")
                        }
                      >
                        {availableRegions.map((region) => (
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

                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontSize: "0.875rem" }}>
                        Sector
                      </InputLabel>
                      <Select
                        multiple
                        value={filters.sector || []}
                        onChange={(e) =>
                          handleFilterChange("sector", e.target.value)
                        }
                        label="Sector"
                        sx={{ fontSize: "0.875rem" }}
                        renderValue={(selected) =>
                          selected.length > 2
                            ? `${selected.length} Selected`
                            : selected.join(", ")
                        }
                      >
                        {availableSectors.map((sector) => (
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
                  </Box>
                </Paper>

                <Grid container spacing={3}>
                  {/* KPI 1: Total Exposure */}
                  <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: "100%",
                        border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                        borderTop: "4px solid #FDB913",
                        borderRadius: 2,
                        backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                        boxShadow:
                          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      }}
                    >
                      <Stack
                        spacing={2}
                        justifyContent="space-between"
                        height="100%"
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Typography
                            variant="overline"
                            color="text.secondary"
                            fontWeight={600}
                            fontSize="0.75rem"
                            letterSpacing={1}
                          >
                            TOTAL EXPOSURE
                          </Typography>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: "50%",
                              backgroundColor: alpha("#FDB913", 0.1),
                            }}
                          >
                            <FileSpreadsheet size={20} color="#FDB913" />
                          </Box>
                        </Stack>
                        <Box>
                          <Typography
                            variant="h4"
                            fontWeight={700}
                            color={isDark ? "#FFF" : "#0F172A"}
                            sx={{ mb: 0.5 }}
                          >
                            {formatCurrency(totalExposure)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Across all active portfolios
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>

                  {/* KPI 2: Asset Count */}
                  <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: "100%",
                        border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                        borderTop: "4px solid #10B981",
                        borderRadius: 2,
                        backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                        boxShadow:
                          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      }}
                    >
                      <Stack
                        spacing={2}
                        justifyContent="space-between"
                        height="100%"
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Typography
                            variant="overline"
                            color="text.secondary"
                            fontWeight={600}
                            fontSize="0.75rem"
                            letterSpacing={1}
                          >
                            TOTAL ASSETS
                          </Typography>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: "50%",
                              backgroundColor: alpha("#10B981", 0.1),
                            }}
                          >
                            <Database size={20} color="#10B981" />
                          </Box>
                        </Stack>
                        <Box>
                          <Typography
                            variant="h4"
                            fontWeight={700}
                            color={isDark ? "#FFF" : "#0F172A"}
                            sx={{ mb: 0.5 }}
                          >
                            {totalAssetCount.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Individual records processed
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>

                  {/* KPI 3: Sectors */}
                  <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: "100%",
                        border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                        borderTop: "4px solid #3B82F6",
                        borderRadius: 2,
                        backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                        boxShadow:
                          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      }}
                    >
                      <Stack
                        spacing={2}
                        justifyContent="space-between"
                        height="100%"
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Typography
                            variant="overline"
                            color="text.secondary"
                            fontWeight={600}
                            fontSize="0.75rem"
                            letterSpacing={1}
                          >
                            ACTIVE SECTORS
                          </Typography>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: "50%",
                              backgroundColor: alpha("#3B82F6", 0.1),
                            }}
                          >
                            <PieChartIcon size={20} color="#3B82F6" />
                          </Box>
                        </Stack>
                        <Box>
                          <Typography
                            variant="h4"
                            fontWeight={700}
                            color={isDark ? "#FFF" : "#0F172A"}
                            sx={{ mb: 0.5 }}
                          >
                            {sectorData.length}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Distinct industry sectors
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>

                  {/* KPI 4: Regions */}
                  <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: "100%",
                        border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                        borderTop: "4px solid #8B5CF6",
                        borderRadius: 2,
                        backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                        boxShadow:
                          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      }}
                    >
                      <Stack
                        spacing={2}
                        justifyContent="space-between"
                        height="100%"
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Typography
                            variant="overline"
                            color="text.secondary"
                            fontWeight={600}
                            fontSize="0.75rem"
                            letterSpacing={1}
                          >
                            REGIONS
                          </Typography>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: "50%",
                              backgroundColor: alpha("#8B5CF6", 0.1),
                            }}
                          >
                            <MapPin size={20} color="#8B5CF6" />
                          </Box>
                        </Stack>
                        <Box>
                          <Typography
                            variant="h4"
                            fontWeight={700}
                            color={isDark ? "#FFF" : "#0F172A"}
                            sx={{ mb: 0.5 }}
                          >
                            {regionData.length}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Geographical areas covered
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Charts Grid - World Bank Style */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(1, 1fr)",
                      md: "repeat(12, 1fr)",
                    },
                    gap: 3,
                  }}
                >
                  {/* Pie Chart - Sector - Blue Accent */}
                  <Box
                    sx={{
                      gridColumn: { xs: "span 12", md: "span 6", lg: "span 4" },
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                        border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                        borderTop: "4px solid #3B82F6",
                        borderRadius: 2,
                        p: 3,
                        height: "100%",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={3}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.5}
                        >
                          <Box
                            sx={{
                              p: 0.5,
                              backgroundColor: alpha("#3B82F6", 0.1),
                              borderRadius: 1,
                            }}
                          >
                            <PieChartIcon size={18} color="#3B82F6" />
                          </Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            color="text.primary"
                          >
                            Exposure by Sector
                          </Typography>
                        </Stack>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() =>
                            handleDrilldown({
                              type: "sector",
                              value: sectorData[0]?.name,
                            })
                          }
                          sx={{
                            textTransform: "none",
                            borderColor: alpha("#3B82F6", 0.3),
                          }}
                        >
                          Details
                        </Button>
                      </Stack>
                      <Box sx={{ height: 250, width: "100%" }}>
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={sectorData.slice(0, 6)}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="exposure"
                              onClick={(data) => handleSectorClick(data.name)}
                            >
                              {sectorData.slice(0, 6).map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                  strokeWidth={0}
                                />
                              ))}
                            </Pie>
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: isDark ? "#1E293B" : "#FFF",
                                borderColor: isDark ? "#334155" : "#E2E8F0",
                                borderRadius: 8,
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                              }}
                              itemStyle={{ color: isDark ? "#FFF" : "#0F172A" }}
                              formatter={(value) => [
                                formatCurrency(Number(value) || 0),
                                "Exposure",
                              ]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                      <Stack spacing={1} mt={2}>
                        {sectorData.slice(0, 3).map((sector, index) => (
                          <Box
                            key={sector.name}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              py: 0.5,
                              borderBottom:
                                index < 2
                                  ? `1px dashed ${alpha("#94A3B8", 0.2)}`
                                  : "none",
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  backgroundColor:
                                    COLORS[index % COLORS.length],
                                }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {sector.name.length > 20
                                  ? sector.name.substring(0, 20) + "..."
                                  : sector.name}
                              </Typography>
                            </Stack>
                            <Typography
                              variant="caption"
                              fontWeight={600}
                              color="text.primary"
                            >
                              {formatCurrency(sector.exposure)}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Paper>
                  </Box>

                  {/* Bar Chart - Region - Purple Accent */}
                  <Box
                    sx={{
                      gridColumn: { xs: "span 12", md: "span 6", lg: "span 4" },
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                        border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                        borderTop: "4px solid #8B5CF6",
                        borderRadius: 2,
                        p: 3,
                        height: "100%",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={3}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.5}
                        >
                          <Box
                            sx={{
                              p: 0.5,
                              backgroundColor: alpha("#8B5CF6", 0.1),
                              borderRadius: 1,
                            }}
                          >
                            <BarChart2 size={18} color="#8B5CF6" />
                          </Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            color="text.primary"
                          >
                            Top Regions
                          </Typography>
                        </Stack>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            handleDrilldown({
                              type: "region",
                              value: regionData[0]?.name,
                            })
                          }
                          sx={{
                            textTransform: "none",
                            borderColor: alpha("#8B5CF6", 0.3),
                            color: "#8B5CF6",
                          }}
                        >
                          Details
                        </Button>
                      </Stack>
                      <Box sx={{ height: 250, width: "100%" }}>
                        <ResponsiveContainer>
                          <BarChart
                            data={regionData.slice(0, 5)}
                            layout="vertical"
                            margin={{ left: 10 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              horizontal={false}
                              stroke={
                                isDark ? alpha("#334155", 0.3) : "#E2E8F0"
                              }
                            />
                            <XAxis type="number" hide />
                            <YAxis
                              type="category"
                              dataKey="name"
                              width={80}
                              tick={{
                                fontSize: 11,
                                fill: isDark ? "#94A3B8" : "#475569",
                              }}
                              tickFormatter={(value) =>
                                value.length > 10
                                  ? `${value.substring(0, 10)}...`
                                  : value
                              }
                            />
                            <RechartsTooltip
                              cursor={{ fill: "transparent" }}
                              contentStyle={{
                                backgroundColor: isDark ? "#1E293B" : "#FFF",
                                borderColor: isDark ? "#334155" : "#E2E8F0",
                                borderRadius: 8,
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                              }}
                              itemStyle={{ color: isDark ? "#FFF" : "#0F172A" }}
                              formatter={(value) => [
                                formatCurrency(Number(value) || 0),
                                "Exposure",
                              ]}
                            />
                            <Bar
                              dataKey="exposure"
                              fill="#8B5CF6"
                              radius={[0, 4, 4, 0]}
                              barSize={20}
                              onClick={(data) =>
                                data.name && handleRegionClick(data.name)
                              }
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </Paper>
                  </Box>

                  {/* Line Chart - Trends - Orange Accent */}
                  <Box
                    sx={{
                      gridColumn: {
                        xs: "span 12",
                        md: "span 12",
                        lg: "span 4",
                      },
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                        border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                        borderTop: "4px solid #FDB913",
                        borderRadius: 2,
                        p: 3,
                        height: "100%",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={3}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.5}
                        >
                          <Box
                            sx={{
                              p: 0.5,
                              backgroundColor: alpha("#FDB913", 0.1),
                              borderRadius: 1,
                            }}
                          >
                            <TrendingUp size={18} color="#FDB913" />
                          </Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            color="text.primary"
                          >
                            Portfolio Trends
                          </Typography>
                        </Stack>
                        <Select
                          size="small"
                          value={timeRange}
                          onChange={(e) => setTimeRange(e.target.value)}
                          sx={{
                            height: 32,
                            fontSize: "0.80rem",
                            ".MuiSelect-select": { py: 0.5 },
                          }}
                        >
                          <MenuItem value="3M">3M</MenuItem>
                          <MenuItem value="6M">6M</MenuItem>
                          <MenuItem value="1Y">1Y</MenuItem>
                        </Select>
                      </Stack>
                      <Box sx={{ height: 250, width: "100%" }}>
                        <ResponsiveContainer>
                          <LineChart
                            data={timeSeriesData}
                            margin={{ left: 10, right: 10 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke={
                                isDark ? alpha("#334155", 0.3) : "#E2E8F0"
                              }
                            />
                            <XAxis
                              dataKey="month"
                              tick={{
                                fontSize: 11,
                                fill: isDark ? "#94A3B8" : "#475569",
                              }}
                              axisLine={false}
                              tickLine={false}
                              dy={10}
                            />
                            <YAxis hide />
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: isDark ? "#1E293B" : "#FFF",
                                borderColor: isDark ? "#334155" : "#E2E8F0",
                                borderRadius: 8,
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                              }}
                              itemStyle={{ color: isDark ? "#FFF" : "#0F172A" }}
                              formatter={(value) => [
                                formatCurrency(Number(value) || 0),
                                "Exposure",
                              ]}
                            />
                            <Line
                              type="monotone"
                              dataKey="exposure"
                              stroke="#FDB913"
                              strokeWidth={3}
                              dot={{
                                r: 4,
                                fill: "#FDB913",
                                strokeWidth: 2,
                                stroke: "#fff",
                              }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </Paper>
                  </Box>

                  {/* Top 5 Exposures Grid Item */}
                  <Box sx={{ gridColumn: "span 12" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                        border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                        borderTop: "4px solid #10B981",
                        borderRadius: 2,
                        p: 3,
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        mb={3}
                      >
                        <Box
                          sx={{
                            p: 0.5,
                            backgroundColor: alpha("#10B981", 0.1),
                            borderRadius: 1,
                          }}
                        >
                          <Layout size={18} color="#10B981" />
                        </Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          color="text.primary"
                        >
                          Top 5 Highest Exposures
                        </Typography>
                      </Stack>

                      <Grid container spacing={2}>
                        {topExposures.map((exposure, index) => (
                          <Grid size={{ xs: 12, md: 4, lg: 2.4 }} key={index}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                height: "100%",
                                backgroundColor: isDark
                                  ? alpha("#1E293B", 0.5)
                                  : "#F8FAFC",
                                border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                                borderLeft: `3px solid ${COLORS[index % COLORS.length]}`,
                                transition: "transform 0.2s",
                                "&:hover": {
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                },
                              }}
                            >
                              <Stack spacing={1}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  noWrap
                                >
                                  {exposure.sector}
                                </Typography>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={700}
                                  color="text.primary"
                                  title={exposure.name}
                                  sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    minHeight: "2.5em",
                                  }}
                                >
                                  {exposure.name}
                                </Typography>
                                <Typography
                                  variant="h6"
                                  fontWeight={800}
                                  color={COLORS[index % COLORS.length]}
                                >
                                  {formatShortCurrency(exposure.exposure)}
                                </Typography>
                              </Stack>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Box>
                </Box>

                {/* Segmented Table */}
                <Paper
                  elevation={0}
                  sx={{
                    backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                    border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    p={3}
                    sx={{
                      borderBottom: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                      background: isDark
                        ? "linear-gradient(to right, #0F1623, #1E293B)"
                        : "linear-gradient(to right, #FFFFFF, #F8FAFC)",
                    }}
                  >
                    <Box>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        mb={0.5}
                      >
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: alpha("#FDB913", 0.1),
                          }}
                        >
                          <TableIcon size={18} color="#FDB913" />
                        </Box>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: "1.125rem",
                            color: isDark ? "#FFFFFF" : "#0F172A",
                          }}
                        >
                          Segmented Assets
                        </Typography>
                      </Stack>

                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                          pl: 5.5,
                        }}
                      >
                        Showing {filteredTableData.length} of {tableData.length}{" "}
                        assets
                      </Typography>
                    </Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      alignItems="center"
                      width={{ xs: "100%", md: "auto" }}
                    >
                      {/* Group By Dropdown */}
                      <FormControl
                        size="small"
                        sx={{
                          minWidth: 160,
                          width: { xs: "100%", sm: "auto" },
                        }}
                      >
                        <InputLabel>Group By</InputLabel>
                        <Select
                          value={groupingMode}
                          label="Group By"
                          onChange={(e) =>
                            setGroupingMode(
                              e.target.value as
                                | "none"
                                | "location"
                                | "borrower"
                                | "sector",
                            )
                          }
                          startAdornment={
                            <Layers
                              size={16}
                              style={{ marginRight: 8, marginLeft: 8 }}
                            />
                          }
                        >
                          <MenuItem value="none">None (All Assets)</MenuItem>
                          <MenuItem value="location">Location</MenuItem>
                          <MenuItem value="sector">Sector</MenuItem>
                          <MenuItem value="borrower">Borrower</MenuItem>
                        </Select>
                      </FormControl>

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
                        sx={{
                          minWidth: 220,
                          width: { xs: "100%", sm: "auto" },
                        }}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          width: { xs: "100%", sm: "auto" },
                        }}
                      >
                        <Button
                          variant="outlined"
                          startIcon={<Save size={18} />}
                          onClick={() => setShowSaveDialog(true)}
                          sx={{
                            borderColor: alpha("#FDB913", 0.5),
                            color: isDark ? "#FDB913" : "#B45309",
                            fontWeight: 600,
                            flex: 1,
                            "&:hover": {
                              borderColor: "#FDB913",
                              backgroundColor: alpha("#FDB913", 0.05),
                            },
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<Download size={18} />}
                          onClick={handleExport}
                          sx={{
                            backgroundColor: "#FDB913",
                            color: "#0F172A",
                            fontWeight: 600,
                            flex: 1,
                            boxShadow: "0 4px 6px -1px rgba(253, 185, 19, 0.4)",
                            "&:hover": {
                              backgroundColor: "#F59E0B",
                            },
                          }}
                        >
                          Export
                        </Button>
                      </Box>
                    </Stack>
                  </Stack>

                  {/* Grouped Table View - World Bank Style */}
                  {groupingMode !== "none" && groupedTableData && (
                    <TableContainer sx={{ maxHeight: 400, mb: 3 }}>
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                letterSpacing: "1px",
                                color: "text.secondary",
                                textTransform: "uppercase",
                                backgroundColor: isDark
                                  ? alpha("#1E293B", 0.9)
                                  : alpha("#F8FAFC", 0.9),
                                borderBottom: `2px solid ${isDark ? "#334155" : "#E2E8F0"}`,
                              }}
                            >
                              {groupingMode}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                letterSpacing: "1px",
                                color: "text.secondary",
                                textTransform: "uppercase",
                                backgroundColor: isDark
                                  ? alpha("#1E293B", 0.9)
                                  : alpha("#F8FAFC", 0.9),
                                borderBottom: `2px solid ${isDark ? "#334155" : "#E2E8F0"}`,
                              }}
                              align="right"
                            >
                              Asset Count
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                letterSpacing: "1px",
                                color: "text.secondary",
                                textTransform: "uppercase",
                                backgroundColor: isDark
                                  ? alpha("#1E293B", 0.9)
                                  : alpha("#F8FAFC", 0.9),
                                borderBottom: `2px solid ${isDark ? "#334155" : "#E2E8F0"}`,
                              }}
                              align="right"
                            >
                              Total Exposure
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {groupedTableData.map((row) => (
                            <TableRow
                              key={row.group}
                              hover
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell
                                sx={{
                                  color: "text.primary",
                                  fontWeight: 600,
                                  fontSize: "0.875rem",
                                  py: 1.5,
                                }}
                              >
                                {row.group}
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  color: "text.primary",
                                  fontSize: "0.875rem",
                                  py: 1.5,
                                }}
                              >
                                {row.count.toLocaleString()}
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  color: "#FDB913",
                                  fontWeight: 700,
                                  fontSize: "0.875rem",
                                  py: 1.5,
                                }}
                              >
                                {formatCurrency(row.exposure)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {/* Detail Table (hidden when grouped) */}
                  <TableContainer
                    sx={{
                      maxHeight: 600,
                      display: groupingMode !== "none" ? "none" : "block",
                    }}
                  >
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              letterSpacing: "1px",
                              color: "text.secondary",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                              backgroundColor: isDark
                                ? alpha("#1E293B", 0.9)
                                : alpha("#F8FAFC", 0.9),
                              borderBottom: `2px solid ${isDark ? "#334155" : "#E2E8F0"}`,
                            }}
                          >
                            Asset Name
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              letterSpacing: "1px",
                              color: "text.secondary",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                              backgroundColor: isDark
                                ? alpha("#1E293B", 0.9)
                                : alpha("#F8FAFC", 0.9),
                              borderBottom: `2px solid ${isDark ? "#334155" : "#E2E8F0"}`,
                            }}
                          >
                            Sector
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              letterSpacing: "1px",
                              color: "text.secondary",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                              backgroundColor: isDark
                                ? alpha("#1E293B", 0.9)
                                : alpha("#F8FAFC", 0.9),
                              borderBottom: `2px solid ${isDark ? "#334155" : "#E2E8F0"}`,
                            }}
                          >
                            Region
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              letterSpacing: "1px",
                              color: "text.secondary",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                              backgroundColor: isDark
                                ? alpha("#1E293B", 0.9)
                                : alpha("#F8FAFC", 0.9),
                              borderBottom: `2px solid ${isDark ? "#334155" : "#E2E8F0"}`,
                            }}
                            align="right"
                          >
                            Exposure
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              letterSpacing: "1px",
                              color: "text.secondary",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                              backgroundColor: isDark
                                ? alpha("#1E293B", 0.9)
                                : alpha("#F8FAFC", 0.9),
                              borderBottom: `2px solid ${isDark ? "#334155" : "#E2E8F0"}`,
                            }}
                          >
                            Actions
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
                            <TableRow
                              key={row.id}
                              hover
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell
                                sx={{
                                  color: "text.primary",
                                  fontWeight: 600,
                                  fontSize: "0.875rem",
                                  py: 1.5,
                                }}
                              >
                                {row.name}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={row.sector}
                                  size="small"
                                  sx={{
                                    backgroundColor: alpha(
                                      COLORS[
                                        availableSectors.indexOf(row.sector) %
                                          COLORS.length
                                      ] || "#FDB913",
                                      0.1,
                                    ),
                                    color:
                                      COLORS[
                                        availableSectors.indexOf(row.sector) %
                                          COLORS.length
                                      ] || "#FDB913",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                    border: `1px solid ${alpha(
                                      COLORS[
                                        availableSectors.indexOf(row.sector) %
                                          COLORS.length
                                      ] || "#FDB913",
                                      0.2,
                                    )}`,
                                  }}
                                />
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.875rem",
                                  py: 1.5,
                                }}
                              >
                                {row.region}
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "0.875rem",
                                  color: "#FDB913",
                                  py: 1.5,
                                }}
                              >
                                {formatCurrency(row.exposure)}
                              </TableCell>
                              <TableCell>
                                <Tooltip title="View Details">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleDrilldown({
                                        type: "asset",
                                        value: row,
                                      })
                                    }
                                    sx={{
                                      color: isDark
                                        ? "rgba(255,255,255,0.7)"
                                        : "rgba(0,0,0,0.54)",
                                      "&:hover": {
                                        color: "#FDB913",
                                        backgroundColor: alpha("#FDB913", 0.1),
                                      },
                                    }}
                                  >
                                    <Eye size={16} />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        {filteredTableData.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              align="center"
                              sx={{ py: 8 }}
                            >
                              <Box
                                sx={{
                                  color: "text.secondary",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <FileSpreadsheet
                                  size={32}
                                  style={{ opacity: 0.5 }}
                                />
                                <Typography>
                                  No assets found matching your search.
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
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
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    sx={{
                      borderTop: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                      color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                    }}
                  />
                </Paper>
              </>
            )}
          </Stack>
        </Box>
      </Box>

      {/* Drill-down Dialog */}
      <Dialog
        open={showDrilldown}
        onClose={() => setShowDrilldown(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: isDark ? "#0F1623" : "#F8FAFC",
            borderBottom: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.25rem",
                color: isDark ? "#FFFFFF" : "#0F172A",
              }}
            >
              {selectedSegment?.type === "sector" &&
                `Sector: ${String(selectedSegment.value)}`}
              {selectedSegment?.type === "region" &&
                `Region: ${String(selectedSegment.value)}`}
              {selectedSegment?.type === "asset" &&
                `Asset Details: ${(selectedSegment.value as AssetDetail)?.name || "Unknown"}`}
            </Typography>
            <IconButton onClick={() => setShowDrilldown(false)} size="small">
              <X size={20} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent
          sx={{ backgroundColor: isDark ? "#0A0E1A" : "#FFFFFF", p: 3 }}
        >
          {selectedSegment?.type === "asset" ? (
            <Stack spacing={3}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    md: "repeat(2, 1fr)",
                  },
                  gap: 3,
                }}
              >
                <Box sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: isDark ? "#FFFFFF" : "#0F172A",
                      mb: 2,
                    }}
                  >
                    Asset Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: `1px solid ${isDark ? alpha("#334155", 0.3) : "#E2E8F0"}`,
                        pb: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                        }}
                      >
                        Asset ID:
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: isDark ? "#FFFFFF" : "#0F172A",
                        }}
                      >
                        {(selectedSegment.value as AssetDetail)?.id || "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: `1px solid ${isDark ? alpha("#334155", 0.3) : "#E2E8F0"}`,
                        pb: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                        }}
                      >
                        Exposure:
                      </Typography>
                      <Typography sx={{ fontWeight: 700, color: "#FDB913" }}>
                        {formatCurrency(
                          (selectedSegment.value as AssetDetail)?.exposure || 0,
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: `1px solid ${isDark ? alpha("#334155", 0.3) : "#E2E8F0"}`,
                        pb: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                        }}
                      >
                        Sector:
                      </Typography>
                      <Chip
                        label={
                          (selectedSegment.value as AssetDetail)?.sector ||
                          "N/A"
                        }
                        size="small"
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: `1px solid ${isDark ? alpha("#334155", 0.3) : "#E2E8F0"}`,
                        pb: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                        }}
                      >
                        Location:
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: isDark ? "#FFFFFF" : "#0F172A",
                        }}
                      >
                        {(selectedSegment.value as AssetDetail)?.region ||
                          "N/A"}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
                <Box sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: isDark ? "#FFFFFF" : "#0F172A",
                      mb: 2,
                    }}
                  >
                    Additional Information
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: isDark
                        ? alpha("#1E293B", 0.5)
                        : alpha("#F1F5F9", 0.5),
                      borderRadius: 2,
                    }}
                  >
                    <Stack spacing={1}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                          }}
                        >
                          Status:
                        </Typography>
                        <Chip
                          label={
                            (selectedSegment.value as AssetDetail)?.status ||
                            "Active"
                          }
                          size="small"
                          sx={{
                            backgroundColor: alpha("#10B981", 0.15),
                            color: "#10B981",
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
              </Box>
            </Stack>
          ) : (
            <Typography
              sx={{ color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B" }}
            >
              Detailed view for {selectedSegment?.type}:{" "}
              {typeof selectedSegment?.value === "string"
                ? selectedSegment.value
                : JSON.stringify(selectedSegment?.value)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: isDark ? "#0F1623" : "#F8FAFC",
            borderTop: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
            p: 2,
          }}
        >
          <Button
            onClick={() => setShowDrilldown(false)}
            sx={{ color: "#64748B" }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleExport();
              setShowDrilldown(false);
            }}
            sx={{
              backgroundColor: "#FDB913",
              color: "#0F172A",
              fontWeight: 600,
            }}
          >
            Export Segment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Segment Dialog */}
      <Dialog
        open={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
            fontWeight: 700,
            color: isDark ? "#FFFFFF" : "#0F172A",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Save size={20} color="#FDB913" />
            <span>Save Segment</span>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <Alert severity="info" icon={<Database size={18} />}>
              <Typography variant="body2">
                Saving <strong>{filteredAssets.length} assets</strong> with
                total exposure of{" "}
                <strong>
                  {formatCurrency(
                    filteredAssets.reduce(
                      (sum, a) => sum + (Number(a.outstandingBalance) || 0),
                      0,
                    ),
                  )}
                </strong>
              </Typography>
            </Alert>
            <TextField
              fullWidth
              label="Segment Name"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              placeholder="e.g., Manufacturing – Ashanti – Kumasi"
              required
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Description (Optional)"
              value={segmentDescription}
              onChange={(e) => setSegmentDescription(e.target.value)}
              placeholder="Brief description of this segment..."
              multiline
              rows={2}
            />
            <Box
              sx={{
                p: 2,
                backgroundColor: isDark ? alpha("#1E293B", 0.5) : "#F8FAFC",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                  mb: 1,
                }}
              >
                Active Filters:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {filters.sector.length > 0 && (
                  <Chip
                    size="small"
                    label={`Sector: ${filters.sector.join(", ")}`}
                    sx={{
                      backgroundColor: alpha("#FDB913", 0.15),
                      color: "#FDB913",
                    }}
                  />
                )}
                {filters.region.length > 0 && (
                  <Chip
                    size="small"
                    label={`Region: ${filters.region.join(", ")}`}
                    sx={{
                      backgroundColor: alpha("#10B981", 0.15),
                      color: "#10B981",
                    }}
                  />
                )}
                {portfolioFilter !== "All" && (
                  <Chip
                    size="small"
                    label={`Portfolio: ${portfolioFilter}`}
                    sx={{
                      backgroundColor: alpha("#3B82F6", 0.15),
                      color: "#3B82F6",
                    }}
                  />
                )}
                {filters.sector.length === 0 &&
                  filters.region.length === 0 &&
                  portfolioFilter === "All" && (
                    <Typography
                      variant="body2"
                      sx={{ color: isDark ? alpha("#FFFFFF", 0.5) : "#94A3B8" }}
                    >
                      No filters applied (full portfolio)
                    </Typography>
                  )}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: isDark ? "#0F1623" : "#F8FAFC",
            borderTop: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
            p: 2,
          }}
        >
          <Button
            onClick={() => setShowSaveDialog(false)}
            sx={{ color: "#64748B" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveSegment}
            disabled={!segmentName.trim()}
            sx={{
              backgroundColor: "#FDB913",
              color: "#0F172A",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#E5A710" },
              "&:disabled": { backgroundColor: alpha("#FDB913", 0.3) },
            }}
          >
            Save Segment
          </Button>
        </DialogActions>
      </Dialog>
    </CRALayout>
  );
}
