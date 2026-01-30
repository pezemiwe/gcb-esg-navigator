import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  alpha,
  useTheme,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import {
  ArrowLeft,
  Download,
  Search,
  FileSpreadsheet,
  TrendingUp,
} from "lucide-react";
import CRALayout from "../layout/CRALayout";
import { useCRADataStore } from "@/store/craStore";

interface DataRow {
  [key: string]: string | number;
}

const DataViewer: React.FC = () => {
  const { assetTypeId } = useParams<{ assetTypeId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { getAssetData } = useCRADataStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");

  const assetData = useMemo(() => {
    if (!assetTypeId) return null;
    return getAssetData(assetTypeId);
  }, [assetTypeId, getAssetData]);

  const mockData = useMemo<DataRow[]>(() => {
    if (assetData && assetData.data.length > 0) {
      return assetData.data as DataRow[];
    }
    const baseDate = new Date(2025, 0, 1).getTime();
    return Array.from({ length: 150 }, (_, i) => ({
      id: `${assetTypeId?.toUpperCase()}-${String(i + 1).padStart(5, "0")}`,
      name: `Asset ${i + 1}`,
      sector: [
        "Manufacturing",
        "Finance",
        "Energy",
        "Technology",
        "Healthcare",
      ][i % 5],
      region: ["Greater Accra", "Ashanti", "Western", "Eastern", "Northern"][
        i % 5
      ],
      exposure: 1000000 + i * 50000,
      rating: ["AAA", "AA", "A", "BBB", "BB"][i % 5],
      maturityDate: new Date(baseDate + i * 86400000 * 30)
        .toISOString()
        .split("T")[0],
      riskLevel: ["Low", "Medium", "High"][i % 3],
    }));
  }, [assetTypeId, assetData]);

  const assetTypeNames: Record<string, string> = {
    loans_advances: "Loans & Advances",
    equities: "Equity Securities",
    bonds_fixed_income: "Fixed Income Securities",
    derivatives: "Derivative Instruments",
    guarantees_obs: "Off-Balance Sheet Exposures",
    other_asset_1: "Other Asset 1",
    other_asset_2: "Other Asset 2",
    other_asset_3: "Other Asset 3",
    other_asset_4: "Other Asset 4",
    other_asset_5: "Other Asset 5",
    other_asset_6: "Other Asset 6",
    other_asset_7: "Other Asset 7",
    other_asset_8: "Other Asset 8",
    other_asset_9: "Other Asset 9",
    other_asset_10: "Other Asset 10",
  };

  const assetName = assetTypeNames[assetTypeId || ""] || "Asset Data";

  const filteredData = mockData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const columns = mockData.length > 0 ? Object.keys(mockData[0]) : [];

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBack = () => {
    navigate("/cra/data");
  };

  const handleUseCRAOverview = () => {
    navigate("/cra");
  };

  const handleDownloadData = () => {
    console.log("Downloading data...");
  };

  return (
    <CRALayout>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: isDark ? "#0A0E1A" : "#F8FAFC",
          py: { xs: 3, md: 4 },
          px: { xs: 2, md: 4 },
        }}
      >
        <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
          <Stack spacing={4}>
            <Box>
              <Breadcrumbs
                sx={{
                  mb: 2,
                  "& .MuiBreadcrumbs-separator": {
                    color: isDark ? alpha("#FFFFFF", 0.5) : "#64748B",
                  },
                }}
              >
                <MuiLink
                  onClick={() => navigate("/cra")}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                    cursor: "pointer",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": {
                      color: "#FDB913",
                    },
                  }}
                >
                  CRA
                </MuiLink>
                <MuiLink
                  onClick={() => navigate("/cra/data")}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                    cursor: "pointer",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": {
                      color: "#FDB913",
                    },
                  }}
                >
                  Data Upload
                </MuiLink>
                <Typography
                  sx={{
                    color: "#FDB913",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  {assetName}
                </Typography>
              </Breadcrumbs>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      backgroundColor: alpha("#FDB913", 0.12),
                      borderRadius: 2,
                      display: "flex",
                    }}
                  >
                    <FileSpreadsheet
                      size={28}
                      color="#FDB913"
                      strokeWidth={2.5}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: isDark ? "#FFFFFF" : "#0F172A",
                        fontSize: { xs: "1.75rem", md: "2.25rem" },
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {assetName}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "0.875rem", md: "1rem" },
                        color: isDark ? alpha("#FFFFFF", 0.65) : "#64748B",
                        mt: 0.5,
                      }}
                    >
                      {filteredData.length.toLocaleString()} records · Last
                      updated:{" "}
                      {assetData?.uploadedAt
                        ? new Date(assetData.uploadedAt).toLocaleDateString()
                        : new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowLeft size={18} />}
                    onClick={handleBack}
                    sx={{
                      borderColor: isDark ? alpha("#334155", 0.7) : "#CBD5E1",
                      color: isDark ? "#94A3B8" : "#475569",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      borderRadius: 1.5,
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#FDB913",
                        color: "#FDB913",
                        backgroundColor: alpha("#FDB913", 0.08),
                      },
                    }}
                  >
                    Back to Upload
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<TrendingUp size={18} />}
                    onClick={handleUseCRAOverview}
                    sx={{
                      backgroundColor: "#FDB913",
                      color: "#0F172A",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      px: 2,
                      py: 1,
                      borderRadius: 1.5,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#F59E0B",
                      },
                    }}
                  >
                    Use in CRA
                  </Button>
                </Stack>
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
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <TextField
                    placeholder="Search data..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <Search
                          size={20}
                          style={{
                            color: isDark ? "#64748B" : "#94A3B8",
                            marginRight: 12,
                          }}
                        />
                      ),
                    }}
                    sx={{
                      width: 400,
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: isDark ? "#0A0E1A" : "#F8FAFC",
                        borderRadius: 1.5,
                        fontSize: "0.9375rem",
                        "& fieldset": {
                          borderColor: isDark
                            ? alpha("#334155", 0.5)
                            : "#CBD5E1",
                        },
                        "&:hover fieldset": {
                          borderColor: isDark ? "#475569" : "#94A3B8",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#FDB913",
                          borderWidth: "2px",
                        },
                        "& input": {
                          color: isDark ? "#FFFFFF" : "#0F172A",
                          py: 1.5,
                        },
                      },
                    }}
                  />

                  <Button
                    variant="outlined"
                    startIcon={<Download size={18} />}
                    onClick={handleDownloadData}
                    sx={{
                      borderColor: isDark ? alpha("#334155", 0.7) : "#CBD5E1",
                      color: isDark ? "#94A3B8" : "#475569",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      borderRadius: 1.5,
                      textTransform: "none",
                    }}
                  >
                    Export Data
                  </Button>
                </Stack>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column}
                            sx={{
                              fontWeight: 600,
                              py: 2,
                              color: isDark ? "#FFFFFF" : "#0F172A",
                              borderBottom: `2px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                              textTransform: "capitalize",
                            }}
                          >
                            {column.replace(/([A-Z])/g, " $1").trim()}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedData.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:hover": {
                              backgroundColor: isDark
                                ? alpha("#1E293B", 0.5)
                                : alpha("#F1F5F9", 0.8),
                            },
                            borderBottom: `1px solid ${isDark ? alpha("#334155", 0.3) : "#E2E8F0"}`,
                          }}
                        >
                          {columns.map((column) => (
                            <TableCell
                              key={column}
                              sx={{
                                py: 2,
                                color: isDark
                                  ? alpha("#FFFFFF", 0.9)
                                  : "#0F172A",
                                fontSize: "0.875rem",
                              }}
                            >
                              {column === "exposure"
                                ? `₵${Number(row[column]).toLocaleString()}`
                                : String(row[column])}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={filteredData.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  sx={{
                    color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                    "& .MuiTablePagination-select": {
                      color: isDark ? "#FFFFFF" : "#0F172A",
                    },
                    "& .MuiTablePagination-selectIcon": {
                      color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                    },
                  }}
                />
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Box>
    </CRALayout>
  );
};

export default DataViewer;
