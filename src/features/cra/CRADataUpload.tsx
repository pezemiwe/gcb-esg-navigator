import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download,
  Search,
  AlertCircle,
  CheckCircle2,
  FileText,
  TrendingUp,
  Database,
  XCircle,
  ChevronDown,
  ChevronUp,
  Check,
  AlertTriangle,
  Clock,
  FileUp,
  BarChart4,
  Building2,
  Shield,
  Landmark,
  Wallet,
} from "lucide-react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  alpha,
  Alert,
  IconButton,
  CircularProgress,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Tooltip,
  Divider,
} from "@mui/material";
import CRALayout from "./layout/CRALayout";
import { useCRADataStore, useCRAStatusStore } from "@/store/craStore";
import type { Asset, AssetTypeData } from "@/store/craStore";
import { downloadExcelTemplate } from "./utils/excelTemplates";

// Professional color scheme
const PROFESSIONAL_COLORS = {
  primary: "#0F172A",
  secondary: "#FDB913",
  accent: "#059669",
  warning: "#D97706",
  error: "#DC2626",
  info: "#2563EB",
  neutral: "#64748B",
  lightBg: "#F8FAFC",
  darkBg: "#0F172A",
  success: "#059669",
};

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
  icon?: React.ElementType;
  priority: "high" | "medium" | "low";
  estimatedRows: number;
}

const CRADataUpload: React.FC = () => {
  const navigate = useNavigate();
  const { assets, setAssetData, clearAssetData } = useCRADataStore();
  const { updateStatus } = useCRAStatusStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const [uploadQueue, setUploadQueue] = useState<string[]>([]);
  const [filterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [assetTypes, setAssetTypes] = useState<AssetType[]>([
    {
      id: "loans_advances",
      name: "Loans & Advances",
      category: "Core Assets",
      description:
        "Corporate, retail, and commercial loan portfolios including term loans and revolving credit facilities",
      templateFile: "loans_advances_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Loan ID",
        "Principal",
        "Interest Rate",
        "Maturity Date",
        "Industry",
        "Region",
        "Collateral Type",
      ],
      icon: Building2,
      priority: "high",
      estimatedRows: 50000,
    },
    {
      id: "equities",
      name: "Equity Securities",
      category: "Investment Portfolio",
      description:
        "Listed and unlisted equity investments across global markets",
      templateFile: "equities_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Security ID",
        "Ticker",
        "Shares Held",
        "Market Value",
        "Sector",
        "ESG Score",
        "Dividend Yield",
      ],
      icon: TrendingUp,
      priority: "high",
      estimatedRows: 25000,
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
        "Currency",
      ],
      icon: Landmark,
      priority: "medium",
      estimatedRows: 35000,
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
        "Risk Category",
      ],
      icon: BarChart4,
      priority: "high",
      estimatedRows: 15000,
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
        "Probability of Default",
      ],
      icon: Shield,
      priority: "medium",
      estimatedRows: 12000,
    },
    {
      id: "investment_property",
      name: "Investment Property",
      category: "Real Assets",
      description:
        "Commercial real estate properties held for investment purposes",
      templateFile: "property_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Property ID",
        "Location",
        "Property Type",
        "Area (sqm)",
        "Valuation",
        "Occupancy Rate",
        "Year Built",
      ],
      icon: Building2,
      priority: "medium",
      estimatedRows: 8000,
    },
    {
      id: "deposits_cash",
      name: "Deposits & Cash Equivalents",
      category: "Liquidity Assets",
      description:
        "Customer deposits, cash reserves, and highly liquid marketable securities",
      templateFile: "deposits_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Account ID",
        "Type",
        "Balance",
        "Currency",
        "Maturity",
        "Interest Rate",
        "Institution",
      ],
      icon: Wallet,
      priority: "low",
      estimatedRows: 100000,
    },
    {
      id: "insurance_assets",
      name: "Insurance & Reinsurance",
      category: "Specialized Assets",
      description:
        "Insurance contracts, reinsurance receivables, and technical reserves",
      templateFile: "insurance_template.xlsx",
      status: "not_uploaded",
      dataFields: [
        "Policy ID",
        "Type",
        "Insured Amount",
        "Premium",
        "Term",
        "Risk Profile",
        "Counterparty",
      ],
      icon: Shield,
      priority: "low",
      estimatedRows: 15000,
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
      icon: Database,
      priority: "low",
      estimatedRows: 5000,
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
      icon: Database,
      priority: "low",
      estimatedRows: 5000,
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
      icon: Database,
      priority: "low",
      estimatedRows: 5000,
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
      icon: Database,
      priority: "low",
      estimatedRows: 5000,
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
      icon: Database,
      priority: "low",
      estimatedRows: 5000,
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
      icon: Database,
      priority: "low",
      estimatedRows: 5000,
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
      icon: Database,
      priority: "low",
      estimatedRows: 5000,
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
      icon: Database,
      priority: "low",
      estimatedRows: 5000,
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
      icon: Database,
      priority: "low",
      estimatedRows: 5000,
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
      icon: Database,
      priority: "low",
      estimatedRows: 5000,
    },
  ]);

  // Sync with store on mount and updates
  React.useEffect(() => {
    setAssetTypes((prev) =>
      prev.map((asset) => {
        const stored = assets[asset.id];
        if (stored) {
          return {
            ...asset,
            status: "uploaded",
            uploadedDate: stored.uploadedAt || new Date().toISOString(),
            rowCount: stored.rowCount,
            columnCount: stored.columnCount,
            uploadedFile: new File([], stored.fileName || "Stored Data"),
          };
        }
        return asset;
      }),
    );
  }, [assets]);

  const statuses = [
    { value: "all", label: "All Status", color: PROFESSIONAL_COLORS.neutral },
    {
      value: "validated",
      label: "Validated",
      color: PROFESSIONAL_COLORS.success,
    },
    { value: "uploaded", label: "Uploaded", color: PROFESSIONAL_COLORS.info },
    {
      value: "not_uploaded",
      label: "Pending",
      color: PROFESSIONAL_COLORS.neutral,
    },
    { value: "error", label: "Error", color: PROFESSIONAL_COLORS.error },
    {
      value: "uploading",
      label: "Uploading",
      color: PROFESSIONAL_COLORS.warning,
    },
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

    try {
      // Read and parse CSV file
      const text = await file.text();
      const lines = text.split("\n").filter((line) => line.trim());

      if (lines.length === 0) {
        throw new Error("Empty file");
      }

      // Parse CSV headers - handle quoted values properly
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = "";
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === "," && !inQuotes) {
            result.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      const headers = parseCSVLine(lines[0]).map((h) =>
        h.replace(/"/g, "").trim(),
      );
      const columnCount = headers.length;

      // Create column mapping
      const columnMap: Record<string, number> = {};
      headers.forEach((header, index) => {
        const key = header.toLowerCase().replace(/[^a-z0-9]/g, "");
        columnMap[key] = index;
      });

      // Helper function to find column value
      const findValue = (patterns: string[], values: string[]): string => {
        for (const pattern of patterns) {
          const idx = columnMap[pattern];
          if (idx !== undefined && values[idx]) {
            return values[idx];
          }
        }
        return "";
      };

      // Parse CSV data
      const parsedAssets: Asset[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]).map((v) =>
          v.replace(/"/g, "").trim(),
        );

        if (values.length > 0 && values.some((v) => v)) {
          // Skip empty rows
          // Find values using flexible column matching
          const id =
            findValue(
              ["id", "assetid", "loanid", "facilityid", "accountid"],
              values,
            ) || `${assetTypeId.toUpperCase()}-${String(i).padStart(5, "0")}`;

          const borrowerName =
            findValue(
              ["borrower", "borrowername", "name", "clientname", "customer"],
              values,
            ) || `Borrower ${i}`;

          const sector =
            findValue(
              ["sector", "industry", "industrysector", "businesstype"],
              values,
            ) || "Unclassified";

          const region =
            findValue(
              ["region", "location", "area", "province", "state", "district"],
              values,
            ) || "Unknown";

          const exposureStr = findValue(
            [
              "exposure",
              "balance",
              "outstandingbalance",
              "amount",
              "principal",
              "loanamount",
            ],
            values,
          );
          const exposure = parseFloat(exposureStr.replace(/[^\d.-]/g, "")) || 0;

          const currency =
            findValue(["currency", "curr", "ccy"], values) || "GHS";

          const status =
            findValue(["status", "accountstatus", "loanstatus"], values) ||
            "Active";

          const latStr = findValue(["latitude", "lat"], values);
          const lngStr = findValue(["longitude", "lng", "lon", "long"], values);

          const row: Asset = {
            id,
            borrowerName,
            sector,
            region,
            outstandingBalance: exposure,
            currency,
            status,
            latitude: latStr ? parseFloat(latStr) : undefined,
            longitude: lngStr ? parseFloat(lngStr) : undefined,
          };

          // Add all other columns as additional properties
          headers.forEach((header, index) => {
            if (
              values[index] &&
              ![
                "id",
                "borrower",
                "sector",
                "region",
                "exposure",
                "currency",
                "status",
                "latitude",
                "longitude",
              ].includes(header.toLowerCase().replace(/[^a-z]/g, ""))
            ) {
              row[header] = values[index];
            }
          });

          parsedAssets.push(row);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      setUploadQueue((prev) => prev.filter((id) => id !== assetTypeId));

      const assetData: AssetTypeData = {
        type: assetTypeId,
        data: parsedAssets,
        uploadedAt: new Date().toISOString(),
        fileName: file.name,
        rowCount: parsedAssets.length,
        columnCount: columnCount,
        validationStatus: "validated",
        validationErrors: [],
      };

      setAssetData(assetTypeId, assetData);
      updateStatus("dataUploaded", true);

      setAssetTypes((prev) =>
        prev.map((asset) => {
          if (asset.id === assetTypeId) {
            return {
              ...asset,
              uploadedFile: file,
              uploadedDate: new Date().toISOString(),
              rowCount: parsedAssets.length,
              columnCount: columnCount,
              status: "validated",
              validationErrors: undefined,
            };
          }
          return asset;
        }),
      );
    } catch (error) {
      setUploadQueue((prev) => prev.filter((id) => id !== assetTypeId));

      setAssetTypes((prev) =>
        prev.map((asset) => {
          if (asset.id === assetTypeId) {
            return {
              ...asset,
              status: "error",
              validationErrors: [
                `Failed to parse CSV: ${(error as Error).message}`,
              ],
            };
          }
          return asset;
        }),
      );
    }
  };

  const handleDownloadTemplate = (assetTypeId: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      downloadExcelTemplate(assetTypeId as any);
    } catch (error) {
      alert("Failed to download template: " + (error as Error).message);
    }
  };

  const handleRemoveFile = (assetTypeId: string) => {
    clearAssetData(assetTypeId);

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

    const hasData = Object.keys(useCRADataStore.getState().assets).length > 1;
    if (!hasData) {
      updateStatus("dataUploaded", false);
    }
  };

  const filteredAssets = assetTypes.filter((asset) => {
    const matchesSearch =
      searchTerm === "" ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.dataFields?.some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesCategory =
      filterCategory === "all" || asset.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || asset.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "uploading":
        return {
          icon: <CircularProgress size={16} />,
          label: "Uploading",
          color: PROFESSIONAL_COLORS.warning,
          bgColor: alpha(PROFESSIONAL_COLORS.warning, 0.08),
          iconComponent: Clock,
        };
      case "validated":
        return {
          icon: <CheckCircle2 size={16} />,
          label: "Validated",
          color: PROFESSIONAL_COLORS.success,
          bgColor: alpha(PROFESSIONAL_COLORS.success, 0.08),
          iconComponent: Check,
        };
      case "error":
        return {
          icon: <AlertCircle size={16} />,
          label: "Validation Error",
          color: PROFESSIONAL_COLORS.error,
          bgColor: alpha(PROFESSIONAL_COLORS.error, 0.08),
          iconComponent: AlertTriangle,
        };
      case "uploaded":
        return {
          icon: <Database size={16} />,
          label: "Uploaded",
          color: PROFESSIONAL_COLORS.info,
          bgColor: alpha(PROFESSIONAL_COLORS.info, 0.08),
          iconComponent: Database,
        };
      default:
        return {
          icon: <Database size={16} />,
          label: "Pending Upload",
          color: PROFESSIONAL_COLORS.neutral,
          bgColor: alpha(PROFESSIONAL_COLORS.neutral, 0.08),
          iconComponent: FileUp,
        };
    }
  };

  const getPriorityConfig = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return {
          label: "High Priority",
          color: PROFESSIONAL_COLORS.error,
          bgColor: alpha(PROFESSIONAL_COLORS.error, 0.08),
        };
      case "medium":
        return {
          label: "Medium Priority",
          color: PROFESSIONAL_COLORS.warning,
          bgColor: alpha(PROFESSIONAL_COLORS.warning, 0.08),
        };
      default:
        return {
          label: "Low Priority",
          color: PROFESSIONAL_COLORS.neutral,
          bgColor: alpha(PROFESSIONAL_COLORS.neutral, 0.08),
        };
    }
  };

  return (
    <CRALayout>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          py: 4,
          px: { xs: 2, md: 4 },
        }}
      >
        <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
          <Stack spacing={4}>
            {/* Header Section */}
            <Card
              elevation={0}
              sx={{
                backgroundColor: "background.paper",
                borderRadius: "4px",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={4} alignItems="center">
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: PROFESSIONAL_COLORS.secondary,
                            fontWeight: 600,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            fontSize: "0.75rem",
                          }}
                        >
                          DATA MANAGEMENT
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 700,
                            color: "text.primary",
                            fontSize: { xs: "1.75rem", md: "2.25rem" },
                            lineHeight: 1.1,
                            mt: 1,
                          }}
                        >
                          Asset Portfolio Data Upload
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          color: "text.secondary",
                          fontSize: "1rem",
                          lineHeight: 1.6,
                          maxWidth: 700,
                        }}
                      >
                        Upload financial asset data for comprehensive climate
                        risk assessment. Ensure all required datasets are
                        validated before proceeding to analysis.
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Filters and Search */}
            <Card
              elevation={0}
              sx={{
                backgroundColor: "background.paper",
                borderRadius: "4px",
                border: "1px solid",
                borderColor: "divider",
                p: 3,
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={3}
                alignItems="center"
              >
                <TextField
                  fullWidth
                  placeholder="Search asset types, descriptions, or data fields..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} color={PROFESSIONAL_COLORS.neutral} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "background.default",
                      borderRadius: "4px",
                      "& fieldset": { borderColor: "divider" },
                      "&:hover fieldset": {
                        borderColor: PROFESSIONAL_COLORS.primary,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: PROFESSIONAL_COLORS.secondary,
                        borderWidth: "1px",
                      },
                    },
                  }}
                />
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ width: { xs: "100%", md: "auto" } }}
                >
                  <TextField
                    select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    sx={{ minWidth: 150 }}
                    size="small"
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: status.color,
                            }}
                          />
                          <Typography>{status.label}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Stack>
            </Card>

            {/* Main Table */}
            <Card
              elevation={0}
              sx={{
                backgroundColor: "background.paper",
                borderRadius: "4px",
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "background.default" }}>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          py: 3,
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          width: "30%",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "text.primary" }}
                        >
                          Asset Type
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          py: 3,
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          width: "15%",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "text.primary" }}
                        >
                          Status
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          py: 3,
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          width: "15%",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "text.primary" }}
                        >
                          Data Metrics
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          py: 3,
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          width: "15%",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "text.primary" }}
                        >
                          Priority
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          py: 3,
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          width: "25%",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "text.primary" }}
                        >
                          Actions
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAssets.map((asset) => {
                      const statusConfig = getStatusConfig(asset.status);
                      const priorityConfig = getPriorityConfig(asset.priority);
                      const IconComponent = asset.icon;

                      return (
                        <React.Fragment key={asset.id}>
                          <TableRow
                            sx={{
                              borderBottom: "1px solid",
                              borderColor: "divider",
                              "&:hover": { backgroundColor: "action.hover" },
                            }}
                          >
                            <TableCell sx={{ py: 3 }}>
                              <Stack spacing={2}>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  <Box
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: "4px",
                                      backgroundColor: alpha(
                                        PROFESSIONAL_COLORS.secondary,
                                        0.1,
                                      ),
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: PROFESSIONAL_COLORS.secondary,
                                    }}
                                  >
                                    {IconComponent && (
                                      <IconComponent size={20} />
                                    )}
                                  </Box>
                                  <Box>
                                    <Typography
                                      sx={{
                                        fontWeight: 600,
                                        color: "text.primary",
                                        fontSize: "0.9375rem",
                                      }}
                                    >
                                      {asset.name}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: "0.75rem",
                                        color: "text.secondary",
                                        mt: 0.5,
                                      }}
                                    >
                                      {asset.category}
                                    </Typography>
                                  </Box>
                                </Stack>
                                <Typography
                                  sx={{
                                    fontSize: "0.8125rem",
                                    color: "text.secondary",
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {asset.description}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell sx={{ py: 3 }}>
                              <Stack spacing={1}>
                                <Chip
                                  icon={statusConfig.icon}
                                  label={statusConfig.label}
                                  size="small"
                                  sx={{
                                    backgroundColor: statusConfig.bgColor,
                                    color: statusConfig.color,
                                    fontWeight: 600,
                                    fontSize: "0.7rem",
                                    height: 24,
                                    width: "fit-content",
                                  }}
                                />
                                {asset.uploadedDate && (
                                  <Typography
                                    sx={{
                                      fontSize: "0.7rem",
                                      color: "text.secondary",
                                    }}
                                  >
                                    {new Date(
                                      asset.uploadedDate,
                                    ).toLocaleDateString()}
                                  </Typography>
                                )}
                              </Stack>
                            </TableCell>

                            <TableCell sx={{ py: 3 }}>
                              {asset.rowCount ? (
                                <Stack spacing={1.5}>
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "0.75rem",
                                        color: "text.secondary",
                                        fontWeight: 500,
                                      }}
                                    >
                                      Records:
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: "0.875rem",
                                        fontWeight: 600,
                                        color: "text.primary",
                                      }}
                                    >
                                      {asset.rowCount.toLocaleString()}
                                    </Typography>
                                  </Stack>
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "0.75rem",
                                        color: "text.secondary",
                                        fontWeight: 500,
                                      }}
                                    >
                                      Fields:
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: "0.875rem",
                                        fontWeight: 600,
                                        color: "text.primary",
                                      }}
                                    >
                                      {asset.columnCount}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              ) : (
                                <Typography
                                  sx={{
                                    fontSize: "0.8125rem",
                                    color: "text.secondary",
                                    fontStyle: "italic",
                                  }}
                                >
                                  No data uploaded
                                </Typography>
                              )}
                            </TableCell>

                            <TableCell sx={{ py: 3 }}>
                              <Chip
                                label={priorityConfig.label}
                                size="small"
                                sx={{
                                  backgroundColor: priorityConfig.bgColor,
                                  color: priorityConfig.color,
                                  fontWeight: 600,
                                  fontSize: "0.7rem",
                                  height: 24,
                                }}
                              />
                            </TableCell>

                            <TableCell sx={{ py: 3 }}>
                              <Stack direction="row" spacing={1}>
                                <Tooltip title="Download template">
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() =>
                                      handleDownloadTemplate(asset.id)
                                    }
                                    sx={{
                                      minWidth: 0,
                                      px: 1.5,
                                      py: 0.5,
                                      borderRadius: "4px",
                                      borderColor: "divider",
                                    }}
                                  >
                                    <Download size={14} />
                                  </Button>
                                </Tooltip>

                                {!asset.uploadedFile && (
                                  <Button
                                    component="label"
                                    variant="contained"
                                    size="small"
                                    sx={{
                                      backgroundColor:
                                        PROFESSIONAL_COLORS.secondary,
                                      color: "#FFFFFF",
                                      px: 2,
                                      py: 0.5,
                                      borderRadius: "4px",
                                      fontSize: "0.75rem",
                                      fontWeight: 600,
                                      textTransform: "none",
                                      "&:hover": {
                                        backgroundColor: alpha(
                                          PROFESSIONAL_COLORS.secondary,
                                          0.9,
                                        ),
                                      },
                                    }}
                                  >
                                    {uploadQueue.includes(asset.id) ? (
                                      <CircularProgress
                                        size={14}
                                        color="inherit"
                                      />
                                    ) : (
                                      "Upload Data"
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
                                )}

                                {asset.uploadedFile && (
                                  <>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      onClick={() =>
                                        navigate(`/cra/data/${asset.id}`)
                                      }
                                      sx={{
                                        backgroundColor:
                                          PROFESSIONAL_COLORS.secondary,
                                        color: "#0F172A",
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: "4px",
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        textTransform: "none",
                                        "&:hover": {
                                          backgroundColor: alpha(
                                            PROFESSIONAL_COLORS.secondary,
                                            0.9,
                                          ),
                                        },
                                      }}
                                    >
                                      View All
                                    </Button>

                                    <Tooltip title="Remove file">
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() =>
                                          handleRemoveFile(asset.id)
                                        }
                                        sx={{
                                          minWidth: 0,
                                          px: 1.5,
                                          py: 0.5,
                                          borderRadius: "4px",
                                          borderColor: alpha(
                                            PROFESSIONAL_COLORS.error,
                                            0.3,
                                          ),
                                          color: PROFESSIONAL_COLORS.error,
                                          "&:hover": {
                                            borderColor:
                                              PROFESSIONAL_COLORS.error,
                                            backgroundColor: alpha(
                                              PROFESSIONAL_COLORS.error,
                                              0.08,
                                            ),
                                          },
                                        }}
                                      >
                                        <XCircle size={14} />
                                      </Button>
                                    </Tooltip>
                                  </>
                                )}

                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    setExpandedAsset(
                                      expandedAsset === asset.id
                                        ? null
                                        : asset.id,
                                    )
                                  }
                                  sx={{ ml: "auto" }}
                                >
                                  {expandedAsset === asset.id ? (
                                    <ChevronUp size={18} />
                                  ) : (
                                    <ChevronDown size={18} />
                                  )}
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>

                          {expandedAsset === asset.id && (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                sx={{
                                  py: 3,
                                  backgroundColor: "background.default",
                                }}
                              >
                                <Stack spacing={3}>
                                  <Divider />
                                  <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 8 }}>
                                      <Stack spacing={2}>
                                        <Typography
                                          sx={{
                                            fontWeight: 600,
                                            color: "text.primary",
                                            fontSize: "0.9375rem",
                                          }}
                                        >
                                          Data Fields & Requirements
                                        </Typography>
                                        {asset.validationErrors ? (
                                          <Alert
                                            severity="error"
                                            sx={{
                                              backgroundColor: alpha(
                                                PROFESSIONAL_COLORS.error,
                                                0.08,
                                              ),
                                              border: `1px solid ${alpha(PROFESSIONAL_COLORS.error, 0.2)}`,
                                              mb: 2,
                                            }}
                                          >
                                            <Stack spacing={1}>
                                              <Typography
                                                sx={{
                                                  fontWeight: 600,
                                                  fontSize: "0.8125rem",
                                                }}
                                              >
                                                Validation Issues Detected
                                              </Typography>
                                              {asset.validationErrors.map(
                                                (error, index) => (
                                                  <Typography
                                                    key={index}
                                                    sx={{ fontSize: "0.75rem" }}
                                                  >
                                                    • {error}
                                                  </Typography>
                                                ),
                                              )}
                                            </Stack>
                                          </Alert>
                                        ) : asset.uploadedFile ? (
                                          <Alert
                                            severity="success"
                                            sx={{
                                              backgroundColor: alpha(
                                                PROFESSIONAL_COLORS.success,
                                                0.08,
                                              ),
                                              border: `1px solid ${alpha(PROFESSIONAL_COLORS.success, 0.2)}`,
                                              mb: 2,
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                fontWeight: 600,
                                                fontSize: "0.8125rem",
                                              }}
                                            >
                                              All validation checks passed
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
                                                  backgroundColor:
                                                    "background.paper",
                                                  border: "1px solid",
                                                  borderColor: "divider",
                                                  color: "text.primary",
                                                  fontSize: "0.7rem",
                                                  height: 24,
                                                }}
                                              />
                                            ),
                                          )}
                                        </Stack>
                                      </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                      <Stack spacing={2}>
                                        <Typography
                                          sx={{
                                            fontWeight: 600,
                                            color: "text.primary",
                                            fontSize: "0.9375rem",
                                          }}
                                        >
                                          File Information
                                        </Typography>
                                        {asset.uploadedFile ? (
                                          <Card
                                            elevation={0}
                                            sx={{
                                              backgroundColor:
                                                "background.paper",
                                              border: "1px solid",
                                              borderColor: "divider",
                                              p: 2,
                                              borderRadius: "4px",
                                            }}
                                          >
                                            <Stack spacing={1}>
                                              <Stack
                                                direction="row"
                                                alignItems="center"
                                                spacing={1}
                                              >
                                                <FileText
                                                  size={14}
                                                  color={
                                                    PROFESSIONAL_COLORS.info
                                                  }
                                                />
                                                <Typography
                                                  sx={{
                                                    fontSize: "0.75rem",
                                                    fontWeight: 500,
                                                    color: "text.primary",
                                                  }}
                                                >
                                                  {asset.uploadedFile.name}
                                                </Typography>
                                              </Stack>
                                              <Typography
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  color: "text.secondary",
                                                }}
                                              >
                                                Size:{" "}
                                                {(
                                                  asset.uploadedFile.size /
                                                  1024 /
                                                  1024
                                                ).toFixed(2)}{" "}
                                                MB
                                              </Typography>
                                              <Typography
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  color: "text.secondary",
                                                }}
                                              >
                                                Type:{" "}
                                                {asset.uploadedFile.type ||
                                                  "Excel/CSV"}
                                              </Typography>
                                            </Stack>
                                          </Card>
                                        ) : (
                                          <Typography
                                            sx={{
                                              fontSize: "0.8125rem",
                                              color: "text.secondary",
                                              fontStyle: "italic",
                                            }}
                                          >
                                            No file uploaded
                                          </Typography>
                                        )}
                                      </Stack>
                                    </Grid>
                                  </Grid>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {filteredAssets.length === 0 && (
                <Box sx={{ py: 8, textAlign: "center" }}>
                  <Database size={48} color={PROFESSIONAL_COLORS.neutral} />
                  <Typography sx={{ mt: 2, color: "text.secondary" }}>
                    No asset types found matching your criteria
                  </Typography>
                </Box>
              )}
            </Card>
          </Stack>
        </Box>
      </Box>
    </CRALayout>
  );
};

export default CRADataUpload;
