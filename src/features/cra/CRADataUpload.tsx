import React, { useState } from "react";
import {
  Upload,
  Download,
  Search,
  Filter,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Info,
  FileText,
  TrendingUp,
  Database,
  XCircle,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Grid3x3,
} from "lucide-react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  alpha,
  useTheme,
  LinearProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  CircularProgress,
  Grid,
} from "@mui/material";
import CRALayout from "./layout/CRALayout";

import { downloadExcelTemplate } from "./utils/excelTemplates";

interface AssetType {
  id: string;
  name: string;
  category: string;
  description: string;
  templateFile: string;
  uploadedFile?: File;
  uploadedDate?: string;
  rowCount?: number;
  columnCount?: number;
  status: "not_uploaded" | "uploading" | "uploaded" | "validated" | "error";
  validationErrors?: string[];
  dataFields?: string[];
}

const CRADataUpload: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const [uploadQueue, setUploadQueue] = useState<string[]>([]);

  const [assetTypes, setAssetTypes] = useState<AssetType[]>([
    {
      id: "loans_advances",
      name: "Loans & Advances",
      category: "Core Assets",
      description:
        "Corporate, retail, and commercial loan portfolios including term loans, revolving credit facilities, and syndicated loans",
      templateFile: "loans_advances_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Loan ID",
        "Principal",
        "Interest Rate",
        "Maturity Date",
        "Industry",
        "Region",
      ],
    },
    {
      id: "equities",
      name: "Equity Securities",
      category: "Trading Assets",
      description:
        "Listed and unlisted equity investments, including common and preferred shares across global markets",
      templateFile: "equities_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Security ID",
        "Ticker",
        "Shares Held",
        "Market Value",
        "Sector",
        "ESG Score",
      ],
    },
    {
      id: "bonds_fixed_income",
      name: "Fixed Income Securities",
      category: "Investment Portfolio",
      description:
        "Government and corporate bonds, money market instruments, and other debt securities",
      templateFile: "bonds_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Bond ISIN",
        "Coupon Rate",
        "Maturity",
        "Credit Rating",
        "Issuer",
        "Yield",
      ],
    },
    {
      id: "derivatives",
      name: "Derivative Instruments",
      category: "Trading Assets",
      description:
        "Options, futures, swaps, forward contracts, and structured products across asset classes",
      templateFile: "derivatives_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Contract ID",
        "Underlying Asset",
        "Notional Value",
        "Expiry",
        "Counterparty",
        "MTM Value",
      ],
    },
    {
      id: "guarantees_obs",
      name: "Off-Balance Sheet Exposures",
      category: "Contingent Liabilities",
      description:
        "Guarantees, letters of credit, undrawn commitments, and other contingent exposures",
      templateFile: "guarantees_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Exposure ID",
        "Type",
        "Notional Amount",
        "Counterparty",
        "Tenor",
        "Collateral",
      ],
    },
    {
      id: "other_asset_1",
      name: "Other Asset 1",
      category: "Additional Assets",
      description:
        "Additional financial asset classification for specialized exposures",
      templateFile: "other_asset_1_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Asset ID",
        "Classification",
        "Value",
        "Risk Category",
        "Region",
      ],
    },
    {
      id: "other_asset_2",
      name: "Other Asset 2",
      category: "Additional Assets",
      description:
        "Additional financial asset classification for specialized exposures",
      templateFile: "other_asset_2_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Asset ID",
        "Classification",
        "Value",
        "Risk Category",
        "Region",
      ],
    },
    {
      id: "other_asset_3",
      name: "Other Asset 3",
      category: "Additional Assets",
      description:
        "Additional financial asset classification for specialized exposures",
      templateFile: "other_asset_3_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Asset ID",
        "Classification",
        "Value",
        "Risk Category",
        "Region",
      ],
    },
    {
      id: "other_asset_4",
      name: "Other Asset 4",
      category: "Additional Assets",
      description:
        "Additional financial asset classification for specialized exposures",
      templateFile: "other_asset_4_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Asset ID",
        "Classification",
        "Value",
        "Risk Category",
        "Region",
      ],
    },
    {
      id: "other_asset_5",
      name: "Other Asset 5",
      category: "Additional Assets",
      description:
        "Additional financial asset classification for specialized exposures",
      templateFile: "other_asset_5_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Asset ID",
        "Classification",
        "Value",
        "Risk Category",
        "Region",
      ],
    },
    {
      id: "other_asset_6",
      name: "Other Asset 6",
      category: "Additional Assets",
      description:
        "Additional financial asset classification for specialized exposures",
      templateFile: "other_asset_6_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Asset ID",
        "Classification",
        "Value",
        "Risk Category",
        "Region",
      ],
    },
    {
      id: "other_asset_7",
      name: "Other Asset 7",
      category: "Additional Assets",
      description:
        "Additional financial asset classification for specialized exposures",
      templateFile: "other_asset_7_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Asset ID",
        "Classification",
        "Value",
        "Risk Category",
        "Region",
      ],
    },
    {
      id: "other_asset_8",
      name: "Other Asset 8",
      category: "Additional Assets",
      description:
        "Additional financial asset classification for specialized exposures",
      templateFile: "other_asset_8_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Asset ID",
        "Classification",
        "Value",
        "Risk Category",
        "Region",
      ],
    },
    {
      id: "other_asset_9",
      name: "Other Asset 9",
      category: "Additional Assets",
      description:
        "Additional financial asset classification for specialized exposures",
      templateFile: "other_asset_9_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Asset ID",
        "Classification",
        "Value",
        "Risk Category",
        "Region",
      ],
    },
    {
      id: "other_asset_10",
      name: "Other Asset 10",
      category: "Additional Assets",
      description:
        "Additional financial asset classification for specialized exposures",
      templateFile: "other_asset_10_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Asset ID",
        "Classification",
        "Value",
        "Risk Category",
        "Region",
      ],
    },
  ]);

  const categories = [
    "all",
    ...new Set(assetTypes.map((asset) => asset.category)),
  ];

  const handleFileUpload = async (assetTypeId: string, file: File) => {
    setUploadQueue((prev) => [...prev, assetTypeId]);

    setAssetTypes((prev) =>
      prev.map((asset) =>
        asset.id === assetTypeId
          ? { ...asset, status: "uploading" as const }
          : asset,
      ),
    );

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setUploadQueue((prev) => prev.filter((id) => id !== assetTypeId));

    setAssetTypes((prev) =>
      prev.map((asset) => {
        if (asset.id === assetTypeId) {
          const success = Math.random() > 0.2;
          return {
            ...asset,
            uploadedFile: file,
            uploadedDate: new Date().toISOString(),
            rowCount: Math.floor(Math.random() * 10000) + 1000,
            columnCount: Math.floor(Math.random() * 20) + 5,
            status: success ? "validated" : "error",
            validationErrors: success
              ? undefined
              : [
                  "Invalid date format in column D",
                  "Missing required field: 'Region'",
                ],
          };
        }
        return asset;
      }),
    );
  };

  const handleDownloadTemplate = (assetTypeId: string) => {
    try {
      downloadExcelTemplate(assetTypeId as keyof typeof TEMPLATE_DEFINITIONS);
    } catch (error) {
      alert("Failed to download template: " + (error as Error).message);
    }
  };

  const handleDownloadData = (assetTypeId: string) => {
    const asset = assetTypes.find((a) => a.id === assetTypeId);
    if (asset?.uploadedFile) {
      console.log(`Downloading data for ${asset.name}`);
    }
  };

  const handleRemoveFile = (assetTypeId: string) => {
    setAssetTypes((prev) =>
      prev.map((asset) =>
        asset.id === assetTypeId
          ? {
              ...asset,
              uploadedFile: undefined,
              uploadedDate: undefined,
              rowCount: undefined,
              columnCount: undefined,
              status: "not_uploaded",
              validationErrors: undefined,
            }
          : asset,
      ),
    );
  };

  const filteredAssets = assetTypes.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.dataFields?.some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesCategory =
      filterCategory === "all" || asset.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const uploadProgress =
    assetTypes.filter((a) => a.status === "validated").length /
    assetTypes.length;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "uploading":
        return {
          icon: <CircularProgress size={16} />,
          label: "Uploading",
          color: "#3B82F6",
          bgColor: alpha("#3B82F6", 0.08),
        };
      case "validated":
        return {
          icon: <CheckCircle2 size={16} />,
          label: "Validated",
          color: "#10B981",
          bgColor: alpha("#10B981", 0.08),
        };
      case "error":
        return {
          icon: <AlertCircle size={16} />,
          label: "Error",
          color: "#EF4444",
          bgColor: alpha("#EF4444", 0.08),
        };
      case "uploaded":
        return {
          icon: <Database size={16} />,
          label: "Uploaded",
          color: "#8B5CF6",
          bgColor: alpha("#8B5CF6", 0.08),
        };
      default:
        return {
          icon: <Database size={16} />,
          label: "Pending",
          color: isDark ? "#64748B" : "#94A3B8",
          bgColor: isDark ? alpha("#64748B", 0.08) : alpha("#94A3B8", 0.08),
        };
    }
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
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Climate Risk Data Upload
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.875rem", md: "1rem" },
                      color: isDark ? alpha("#FFFFFF", 0.65) : "#64748B",
                      mt: 0.5,
                    }}
                  >
                    Upload financial asset data for comprehensive climate risk
                    assessment
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
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <TextField
                  fullWidth
                  placeholder="Search assets, data fields, or descriptions..."
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
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: isDark ? "#0A0E1A" : "#F8FAFC",
                      borderRadius: 1.5,
                      fontSize: "0.9375rem",
                      "& fieldset": {
                        borderColor: isDark ? alpha("#334155", 0.5) : "#CBD5E1",
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
                {/* <FormControl sx={{ minWidth: 180 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    label="Category"
                    startAdornment={
                      <Filter size={16} style={{ marginRight: 8 }} />
                    }
                    sx={{
                      borderRadius: 1.5,
                      fontSize: "0.9375rem",
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
              </Stack>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 300, fontWeight: 600, py: 2 }}>
                        Asset Type
                      </TableCell>
                      <TableCell sx={{ width: 150, fontWeight: 600, py: 2 }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ width: 200, fontWeight: 600, py: 2 }}>
                        File Details
                      </TableCell>
                      <TableCell sx={{ width: 150, fontWeight: 600, py: 2 }}>
                        Data Summary
                      </TableCell>
                      <TableCell sx={{ width: 200, fontWeight: 600, py: 2 }}>
                        Actions
                      </TableCell>
                      <TableCell sx={{ width: 50, py: 2 }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAssets.map((asset) => {
                      const statusConfig = getStatusConfig(asset.status);
                      return (
                        <React.Fragment key={asset.id}>
                          <TableRow
                            sx={{
                              backgroundColor: isDark
                                ? expandedAsset === asset.id
                                  ? "#1A2236"
                                  : "transparent"
                                : expandedAsset === asset.id
                                  ? "#F8FAFC"
                                  : "transparent",
                              borderBottom: `1px solid ${isDark ? alpha("#334155", 0.3) : "#E2E8F0"}`,
                              "&:hover": {
                                backgroundColor: isDark
                                  ? alpha("#1E293B", 0.5)
                                  : alpha("#F1F5F9", 0.8),
                              },
                            }}
                          >
                            <TableCell sx={{ py: 2.5 }}>
                              <Stack spacing={0.5}>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1.5}
                                >
                                  <Box
                                    sx={{
                                      p: 1,
                                      backgroundColor: alpha("#FDB913", 0.1),
                                      borderRadius: 1,
                                      display: "flex",
                                    }}
                                  >
                                    <FileSpreadsheet
                                      size={18}
                                      color="#FDB913"
                                    />
                                  </Box>
                                  <Box>
                                    <Typography
                                      sx={{
                                        fontWeight: 600,
                                        color: isDark ? "#FFFFFF" : "#0F172A",
                                        fontSize: "0.9375rem",
                                      }}
                                    >
                                      {asset.name}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: "0.75rem",
                                        color: isDark
                                          ? alpha("#FFFFFF", 0.5)
                                          : "#64748B",
                                      }}
                                    >
                                      {asset.category}
                                    </Typography>
                                  </Box>
                                </Stack>
                                <Typography
                                  sx={{
                                    fontSize: "0.8125rem",
                                    color: isDark
                                      ? alpha("#FFFFFF", 0.7)
                                      : "#475569",
                                    lineHeight: 1.4,
                                    mt: 1,
                                  }}
                                >
                                  {asset.description}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ py: 2.5 }}>
                              <Chip
                                icon={statusConfig.icon}
                                label={statusConfig.label}
                                size="small"
                                sx={{
                                  backgroundColor: statusConfig.bgColor,
                                  color: statusConfig.color,
                                  fontWeight: 600,
                                  fontSize: "0.75rem",
                                  height: 28,
                                  "& .MuiChip-icon": {
                                    color: statusConfig.color,
                                    ml: 1,
                                  },
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 2.5 }}>
                              {asset.uploadedFile ? (
                                <Stack spacing={1}>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                  >
                                    <FileText
                                      size={16}
                                      color={isDark ? "#94A3B8" : "#64748B"}
                                    />
                                    <Typography
                                      sx={{
                                        fontSize: "0.8125rem",
                                        fontWeight: 500,
                                        color: isDark ? "#FFFFFF" : "#0F172A",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {asset.uploadedFile.name}
                                    </Typography>
                                  </Stack>
                                  <Typography
                                    sx={{
                                      fontSize: "0.75rem",
                                      color: isDark
                                        ? alpha("#FFFFFF", 0.5)
                                        : "#64748B",
                                    }}
                                  >
                                    Uploaded:{" "}
                                    {new Date(
                                      asset.uploadedDate!,
                                    ).toLocaleDateString()}
                                  </Typography>
                                </Stack>
                              ) : (
                                <Typography
                                  sx={{
                                    fontSize: "0.8125rem",
                                    color: isDark
                                      ? alpha("#FFFFFF", 0.5)
                                      : "#64748B",
                                    fontStyle: "italic",
                                  }}
                                >
                                  No file uploaded
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell sx={{ py: 2.5 }}>
                              {asset.rowCount ? (
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Stack alignItems="center">
                                    <Stack
                                      direction="row"
                                      spacing={0.5}
                                      alignItems="center"
                                    >
                                      <BarChart3
                                        size={14}
                                        color={isDark ? "#94A3B8" : "#64748B"}
                                      />
                                      <Typography
                                        sx={{
                                          fontSize: "0.875rem",
                                          fontWeight: 700,
                                          color: isDark ? "#FFFFFF" : "#0F172A",
                                        }}
                                      >
                                        {asset.rowCount?.toLocaleString()}
                                      </Typography>
                                    </Stack>
                                    <Typography
                                      sx={{
                                        fontSize: "0.7rem",
                                        color: isDark
                                          ? alpha("#FFFFFF", 0.5)
                                          : "#64748B",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      Rows
                                    </Typography>
                                  </Stack>
                                  <Stack alignItems="center">
                                    <Stack
                                      direction="row"
                                      spacing={0.5}
                                      alignItems="center"
                                    >
                                      <Grid3x3
                                        size={14}
                                        color={isDark ? "#94A3B8" : "#64748B"}
                                      />
                                      <Typography
                                        sx={{
                                          fontSize: "0.875rem",
                                          fontWeight: 700,
                                          color: isDark ? "#FFFFFF" : "#0F172A",
                                        }}
                                      >
                                        {asset.columnCount}
                                      </Typography>
                                    </Stack>
                                    <Typography
                                      sx={{
                                        fontSize: "0.7rem",
                                        color: isDark
                                          ? alpha("#FFFFFF", 0.5)
                                          : "#64748B",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      Columns
                                    </Typography>
                                  </Stack>
                                </Stack>
                              ) : (
                                <Typography
                                  sx={{
                                    fontSize: "0.8125rem",
                                    color: isDark
                                      ? alpha("#FFFFFF", 0.5)
                                      : "#64748B",
                                    fontStyle: "italic",
                                  }}
                                >
                                  No data
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell sx={{ py: 2.5 }}>
                              <Stack direction="row" spacing={1}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() =>
                                    handleDownloadTemplate(asset.id)
                                  }
                                  sx={{
                                    borderColor: isDark
                                      ? alpha("#334155", 0.7)
                                      : "#CBD5E1",
                                    color: isDark ? "#94A3B8" : "#475569",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 1,
                                    textTransform: "none",
                                    minWidth: 90,
                                  }}
                                >
                                  Template
                                </Button>
                                <Button
                                  component="label"
                                  variant="contained"
                                  size="small"
                                  sx={{
                                    backgroundColor: asset.uploadedFile
                                      ? "#8B5CF6"
                                      : "#FDB913",
                                    color: "#0F172A",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 1,
                                    textTransform: "none",
                                    minWidth: 90,
                                    "&:hover": {
                                      backgroundColor: asset.uploadedFile
                                        ? "#7C3AED"
                                        : "#F59E0B",
                                    },
                                  }}
                                >
                                  {uploadQueue.includes(asset.id) ? (
                                    <CircularProgress
                                      size={16}
                                      color="inherit"
                                    />
                                  ) : asset.uploadedFile ? (
                                    "Replace"
                                  ) : (
                                    "Upload"
                                  )}
                                  <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    hidden
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleFileUpload(asset.id, file);
                                      }
                                    }}
                                  />
                                </Button>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ py: 2.5 }}>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setExpandedAsset(
                                    expandedAsset === asset.id
                                      ? null
                                      : asset.id,
                                  )
                                }
                              >
                                {expandedAsset === asset.id ? (
                                  <ChevronUp size={20} />
                                ) : (
                                  <ChevronDown size={20} />
                                )}
                              </IconButton>
                            </TableCell>
                          </TableRow>
                          {expandedAsset === asset.id && (
                            <TableRow>
                              <TableCell colSpan={6} sx={{ py: 3 }}>
                                <Paper
                                  elevation={0}
                                  sx={{
                                    backgroundColor: isDark
                                      ? "#1A2236"
                                      : "#F8FAFC",
                                    borderRadius: 1.5,
                                    p: 3,
                                  }}
                                >
                                  <Grid container spacing={3}>
                                    <Grid item xs={8}>
                                      <Typography
                                        sx={{
                                          fontWeight: 600,
                                          color: isDark ? "#FFFFFF" : "#0F172A",
                                          fontSize: "0.9375rem",
                                          mb: 2,
                                        }}
                                      >
                                        Data Fields & Validation
                                      </Typography>
                                      {asset.validationErrors ? (
                                        <Alert
                                          severity="error"
                                          sx={{
                                            mb: 2,
                                            backgroundColor: alpha(
                                              "#EF4444",
                                              0.08,
                                            ),
                                            border: `1px solid ${alpha("#EF4444", 0.2)}`,
                                            "& .MuiAlert-icon": {
                                              color: "#EF4444",
                                            },
                                          }}
                                        >
                                          <Box>
                                            <Typography
                                              sx={{
                                                fontWeight: 600,
                                                fontSize: "0.8125rem",
                                                mb: 1,
                                              }}
                                            >
                                              Validation Issues Detected
                                            </Typography>
                                            {asset.validationErrors.map(
                                              (error, index) => (
                                                <Typography
                                                  key={index}
                                                  sx={{
                                                    fontSize: "0.75rem",
                                                    color: isDark
                                                      ? alpha("#FFFFFF", 0.8)
                                                      : "#475569",
                                                  }}
                                                >
                                                  • {error}
                                                </Typography>
                                              ),
                                            )}
                                          </Box>
                                        </Alert>
                                      ) : asset.uploadedFile ? (
                                        <Alert
                                          severity="success"
                                          sx={{
                                            backgroundColor: alpha(
                                              "#10B981",
                                              0.08,
                                            ),
                                            border: `1px solid ${alpha("#10B981", 0.2)}`,
                                            "& .MuiAlert-icon": {
                                              color: "#10B981",
                                            },
                                          }}
                                        >
                                          <Typography
                                            sx={{
                                              fontWeight: 600,
                                              fontSize: "0.8125rem",
                                            }}
                                          >
                                            All data validation checks passed
                                            successfully
                                          </Typography>
                                        </Alert>
                                      ) : null}
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        flexWrap="wrap"
                                        gap={1}
                                      >
                                        {asset.dataFields?.map(
                                          (field, index) => (
                                            <Chip
                                              key={index}
                                              label={field}
                                              size="small"
                                              sx={{
                                                backgroundColor: isDark
                                                  ? alpha("#334155", 0.5)
                                                  : alpha("#E2E8F0", 0.8),
                                                color: isDark
                                                  ? "#CBD5E1"
                                                  : "#475569",
                                                fontSize: "0.7rem",
                                                height: 24,
                                              }}
                                            />
                                          ),
                                        )}
                                      </Stack>
                                    </Grid>
                                    <Grid item xs={4}>
                                      <Stack spacing={2}>
                                        {asset.uploadedFile && (
                                          <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Download size={14} />}
                                            onClick={() =>
                                              handleDownloadData(asset.id)
                                            }
                                            fullWidth
                                            sx={{
                                              borderColor: isDark
                                                ? alpha("#334155", 0.7)
                                                : "#CBD5E1",
                                              color: isDark
                                                ? "#94A3B8"
                                                : "#475569",
                                              fontSize: "0.75rem",
                                              fontWeight: 600,
                                              py: 0.75,
                                              borderRadius: 1,
                                              textTransform: "none",
                                            }}
                                          >
                                            Download Data
                                          </Button>
                                        )}
                                        {asset.uploadedFile && (
                                          <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<XCircle size={14} />}
                                            onClick={() =>
                                              handleRemoveFile(asset.id)
                                            }
                                            fullWidth
                                            sx={{
                                              borderColor: alpha(
                                                "#EF4444",
                                                0.3,
                                              ),
                                              color: "#EF4444",
                                              fontSize: "0.75rem",
                                              fontWeight: 600,
                                              py: 0.75,
                                              borderRadius: 1,
                                              textTransform: "none",
                                              "&:hover": {
                                                borderColor: "#EF4444",
                                                backgroundColor: alpha(
                                                  "#EF4444",
                                                  0.08,
                                                ),
                                              },
                                            }}
                                          >
                                            Remove File
                                          </Button>
                                        )}
                                      </Stack>
                                    </Grid>
                                  </Grid>
                                </Paper>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* <Paper
              elevation={0}
              sx={{
                backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                borderRadius: 2.5,
                p: 4,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  color: isDark ? "#FFFFFF" : "#0F172A",
                  fontSize: "1.25rem",
                  mb: 3,
                }}
              >
                Upload Analytics Dashboard
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      backgroundColor: isDark
                        ? alpha("#1E293B", 0.5)
                        : "#F8FAFC",
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
                      {assetTypes.length}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.8125rem",
                        color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Total Asset Classes
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      backgroundColor: isDark
                        ? alpha("#1E293B", 0.5)
                        : "#F8FAFC",
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
                      {
                        assetTypes.filter((a) => a.status === "validated")
                          .length
                      }
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.8125rem",
                        color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Validated
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      backgroundColor: isDark
                        ? alpha("#1E293B", 0.5)
                        : "#F8FAFC",
                      borderRadius: 2,
                      p: 3,
                      border: `1px solid ${isDark ? alpha("#334155", 0.3) : "#E2E8F0"}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "2.5rem",
                        fontWeight: 800,
                        color: "#8B5CF6",
                        mb: 0.5,
                        lineHeight: 1,
                      }}
                    >
                      {assetTypes
                        .reduce((sum, a) => sum + (a.rowCount || 0), 0)
                        .toLocaleString()}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.8125rem",
                        color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Total Records
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      backgroundColor: isDark
                        ? alpha("#1E293B", 0.5)
                        : "#F8FAFC",
                      borderRadius: 2,
                      p: 3,
                      border: `1px solid ${isDark ? alpha("#334155", 0.3) : "#E2E8F0"}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "2.5rem",
                        fontWeight: 800,
                        color: "#EF4444",
                        mb: 0.5,
                        lineHeight: 1,
                      }}
                    >
                      {assetTypes.filter((a) => a.status === "error").length}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.8125rem",
                        color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Requiring Attention
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper> */}
          </Stack>
        </Box>
      </Box>
    </CRALayout>
  );
};

export default CRADataUpload;
