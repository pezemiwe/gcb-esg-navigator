/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
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
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  TextField,
  Chip,
} from "@mui/material";
import {
  AlertTriangle,
  Zap,
  Droplet,
  Wind,
  Activity,
  Play,
  Flame,
  Waves,
  Mountain,
  ThermometerSnowflake,
  Plus,
  Eye,
} from "lucide-react";
import {
  usePRARiskStore,
  useCRAStatusStore,
  useCRADataStore,
} from "@/store/craStore";
import CRALayout from "../layout/CRALayout";
import type { Asset } from "@/types/craTypes";

// --- Constants ---

// Initial Risk Types (Custom ones will be added to this list in state)
const INITIAL_RISK_TYPES = [
  { id: "flood", label: "Flood", icon: Droplet, color: "#3B82F6" },
  {
    id: "drought",
    label: "Drought",
    icon: ThermometerSnowflake,
    color: "#F59E0B",
  },
  { id: "heatwave", label: "Heat Wave", icon: Zap, color: "#EC4899" },
  { id: "sea_level", label: "Sea Level Rise", icon: Waves, color: "#10B981" },
  { id: "cyclone", label: "Storm / Cyclone", icon: Wind, color: "#64748B" },
  { id: "landslide", label: "Landslide", icon: Mountain, color: "#8B5CF6" },
  { id: "wildfire", label: "Wildfire", icon: Flame, color: "#EF4444" },
  {
    id: "coastal_erosion",
    label: "Coastal Erosion",
    icon: Activity,
    color: "#0EA5E9",
  },
  {
    id: "cold_wave",
    label: "Cold Wave / Frost",
    icon: ThermometerSnowflake,
    color: "#6366F1",
  },
];

const MAPPING_METHODS = [
  { value: "location", label: "Location", desc: "Location-based assessment" },
  { value: "region", label: "Region", desc: "Regional climate patterns" },
  { value: "sector", label: "Sector", desc: "Sectoral vulnerability" },
];

const IMPACT_LEVELS = ["Very Low", "Low", "Medium", "High", "Very High"];
const LIKELIHOOD_LEVELS = ["Very Low", "Low", "Medium", "High", "Very High"];

// --- Helper Functions ---

// Deterministic pseudo-random score generator
const getDeterministicScore = (seed: string): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 5) + 1; // 1 to 5
};

// Generate matrix from assets
const calculateMatrixConfig = (
  assets: Asset[],
  riskId: string,
  method: string,
) => {
  // Initialize 5x5 Matrix (Likelihood x Impact)
  const matrix = Array(5)
    .fill(0)
    .map(() =>
      Array(5)
        .fill(0)
        .map(() => ({ count: 0, exposure: 0, assets: [] as any[] })),
    );

  const tableRows: any[] = [];

  // Group assets by method key
  const assetGroups: Record<string, Asset[]> = {};
  const allAssetsWithScores: any[] = [];

  assets.forEach((asset) => {
    let key = "Unknown";
    // Using region as proxy if location field missing, or fix below
    if (method === "location")
      key = (asset as any).location || asset.region || "Accra";
    if (method === "region") key = asset.region || "Greater Accra";
    if (method === "sector") key = asset.sector || "General";

    if (!assetGroups[key]) assetGroups[key] = [];
    assetGroups[key].push(asset);
  });

  // Calculate scores for each group (simulating location-based risk)
  Object.keys(assetGroups).forEach((key) => {
    const groupAssets = assetGroups[key];
    const impactScore = getDeterministicScore(
      `${riskId}-${method}-${key}-impact`,
    );
    const likelihoodScore = getDeterministicScore(
      `${riskId}-${method}-${key}-likelihood`,
    );
    const riskScore = impactScore * likelihoodScore;

    const impactLabel = IMPACT_LEVELS[impactScore - 1];
    const likelihoodLabel = LIKELIHOOD_LEVELS[likelihoodScore - 1];

    // Add to table data
    tableRows.push({
      key,
      impact: impactLabel,
      impactScore,
      likelihood: likelihoodLabel,
      likelihoodScore,
      riskScore,
    });

    // Add assets to matrix
    // Matrix indices: Y=Impact, X=Likelihood
    // We map 1-5 score to 0-4 index
    const impactIdx = impactScore - 1;
    const likelihoodIdx = likelihoodScore - 1;

    groupAssets.forEach((asset) => {
      matrix[likelihoodIdx][impactIdx].count++;
      matrix[likelihoodIdx][impactIdx].exposure +=
        asset.outstandingBalance || 0;
      matrix[likelihoodIdx][impactIdx].assets.push({
        ...asset,
        impactScore,
        likelihoodScore,
        riskScore,
        impactLabel,
        likelihoodLabel,
        key,
      });

      allAssetsWithScores.push({
        ...asset,
        impactScore,
        likelihoodScore,
        riskScore,
        impactLabel,
        likelihoodLabel,
        key,
      });
    });
  });

  return { matrix, tableRows, allAssetsWithScores };
};

// --- Main Component ---

export default function PhysicalRiskAssessment() {
  const theme = useTheme();
  const navigate = useNavigate();

  // Store
  const {
    selectedRisks,
    riskConfigurations,
    riskResults,
    setSelectedRisks,
    updateRiskConfig,
    setRiskResults,
  } = usePRARiskStore();
  const { setPRAReady } = useCRAStatusStore();
  const { assets } = useCRADataStore();

  // Local State
  const [viewMode, setViewMode] = useState<
    "decision" | "setup" | "processing" | "overview"
  >("decision");
  const [activeMatrixTab, setActiveMatrixTab] = useState(0);
  const [customRisks, setCustomRisks] = useState<
    Array<{ id: string; label: string }>
  >([]);
  const [showAddRiskModal, setShowAddRiskModal] = useState(false);
  const [newRiskName, setNewRiskName] = useState("");

  // Preview
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<{
    riskId: string;
    tables: any[];
  } | null>(null);

  // Drill Down
  const [drillDownCell, setDrillDownCell] = useState<{
    l: number;
    i: number;
    riskId: string;
    method: string;
    assets: any[];
  } | null>(null);

  // Full Details View
  const [showFullDetails, setShowFullDetails] = useState(false);

  // Computed
  const hasUploadedAssets = Object.values(assets).some(
    (assetType) => assetType.data && assetType.data.length > 0,
  );

  const uploadedAssetTypes = Object.keys(assets).filter(
    (key) => assets[key].data && assets[key].data.length > 0,
  );

  const allRiskTypes = useMemo(() => {
    return [...INITIAL_RISK_TYPES, ...customRisks];
  }, [customRisks]);

  // Logic to flatten results for the Overview Tabs
  const allMatrices = useMemo(() => {
    const flat: Array<{
      riskId: string;
      method: string;
      matrix: any;
      riskLabel: string;
      methodLabel: string;
    }> = [];

    Object.keys(riskResults).forEach((riskId) => {
      const riskLabel =
        allRiskTypes.find((r) => r.id === riskId)?.label || riskId;
      const methodResults = riskResults[riskId];
      if (typeof methodResults === "object" && methodResults !== null) {
        Object.keys(methodResults).forEach((method) => {
          const methodLabel =
            MAPPING_METHODS.find((m) => m.value === method)?.label || method;

          const resultData = (methodResults as any)[method];
          // Handle both old (array only) and new (object with matrix) formats
          const matrix = Array.isArray(resultData)
            ? resultData
            : resultData?.matrix;
          const allAssets = Array.isArray(resultData)
            ? []
            : resultData?.allAssetsWithScores || [];

          if (matrix) {
            flat.push({
              riskId,
              method,
              matrix,
              allAssets,
              riskLabel,
              methodLabel,
            });
          }
        });
      }
    });
    return flat;
  }, [riskResults, allRiskTypes]);

  // Initial Check
  useEffect(() => {
    if (Object.keys(riskResults).length > 0) {
      if (viewMode === "decision") setViewMode("overview");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskResults]);

  // --- Handlers ---

  const handleToggleRisk = (riskId: string) => {
    if (selectedRisks.includes(riskId)) {
      setSelectedRisks(selectedRisks.filter((id) => id !== riskId));
    } else {
      setSelectedRisks([...selectedRisks, riskId]);
      if (!riskConfigurations[riskId]) {
        updateRiskConfig(riskId, {
          riskId,
          mappingMethod: [],
          selectedAssets: [],
          justification: "",
        });
      }
    }
  };

  const handleConfigChange = (
    riskId: string,
    field: keyof (typeof riskConfigurations)[string],
    value: unknown,
  ) => {
    updateRiskConfig(riskId, { [field]: value });
  };

  const handleAddCustomRisk = () => {
    if (newRiskName.trim()) {
      const newRisk = {
        id: `custom_${Date.now()}`,
        label: newRiskName.trim(),
        icon: AlertTriangle,
        color: "#64748B",
      };
      setCustomRisks([...customRisks, newRisk]);
      setNewRiskName("");
      setShowAddRiskModal(false);
    }
  };

  const handlePreview = (riskId: string) => {
    const config = riskConfigurations[riskId];
    if (!config) return;
    const methods = Array.isArray(config.mappingMethod)
      ? config.mappingMethod
      : [config.mappingMethod];
    const assetKeys = config.selectedAssets || [];

    // Gather assets
    const selectedAssetData = assetKeys.flatMap(
      (key) => assets[key]?.data || [],
    );

    const previewTables = methods.map((method: string) => {
      const { tableRows } = calculateMatrixConfig(
        selectedAssetData,
        riskId,
        method as string,
      );
      return { method, data: tableRows };
    });

    setPreviewData({ riskId, tables: previewTables });
    setShowPreviewModal(true);
  };

  const handleRunAssessment = () => {
    setViewMode("processing");

    setTimeout(() => {
      const newResults: Record<string, any> = {};

      selectedRisks.forEach((riskId) => {
        const config = riskConfigurations[riskId];
        if (!config) return;

        const methods = Array.isArray(config.mappingMethod)
          ? config.mappingMethod
          : [config.mappingMethod];
        const assetKeys = config.selectedAssets || [];
        const selectedAssetData = assetKeys.flatMap(
          (key) =>
            assets[key]?.data.map((d: any) => ({
              ...d,
              assetType: assets[key].type,
            })) || [],
        );

        newResults[riskId] = {};

        methods.forEach((method: string) => {
          const { matrix, allAssetsWithScores } = calculateMatrixConfig(
            selectedAssetData,
            riskId,
            method,
          );
          newResults[riskId][method] = { matrix, allAssetsWithScores };
        });
      });

      setRiskResults({ ...riskResults, ...newResults });
      setPRAReady(true);
      setViewMode("overview");
      setActiveMatrixTab(0); // Reset to first tab
    }, 2500);
  };

  const handleCellClick = (
    l: number,
    i: number,
    riskId: string,
    method: string,
    cellAssets: any[],
  ) => {
    if (cellAssets && cellAssets.length > 0) {
      setDrillDownCell({ l, i, riskId, method, assets: cellAssets });
    }
  };

  // --- Views ---

  // 1. Decision Gate
  if (!hasUploadedAssets) {
    return (
      <CRALayout>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            textAlign: "center",
            gap: 3,
            p: 3,
          }}
        >
          <AlertTriangle size={64} color={theme.palette.warning.main} />
          <Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              No Asset Data Uploaded
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ maxWidth: 500, mx: "auto" }}
            >
              Please upload asset data first before configuring physical risk
              assessments.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/cra/data")}
          >
            Go to Data Upload
          </Button>
        </Box>
      </CRALayout>
    );
  }

  // 2. Decision / Start Screen (When Assets Exist)
  if (viewMode === "decision") {
    return (
      <CRALayout>
        <Box
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}
        >
          <Paper sx={{ p: 6, textAlign: "center", maxWidth: 600 }}>
            <Activity
              size={48}
              style={{ marginBottom: 16, color: theme.palette.primary.main }}
            />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Physical Risk Assessment
            </Typography>
            <Typography color="text.secondary" paragraph>
              Configure and run physical risk assessments on your uploaded
              assets. Map risks by Location, Region, or Sector and generate
              aggregate risk matrices.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => setViewMode("setup")}
            >
              Start New Assessment
            </Button>
          </Paper>
        </Box>
      </CRALayout>
    );
  }

  // 3. Processing
  if (viewMode === "processing") {
    return (
      <CRALayout>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
            gap: 2,
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h5">Analyzing Portfolio Exposure...</Typography>
          <Typography color="text.secondary">
            Mapping assets to hazard layers...
          </Typography>
        </Box>
      </CRALayout>
    );
  }

  // 4. Setup Wizard
  if (viewMode === "setup") {
    return (
      <CRALayout>
        <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Configuration
              </Typography>
              <Typography color="text.secondary">
                Select risks and mapping parameters
              </Typography>
            </Box>
            <Button variant="outlined" onClick={() => setViewMode("decision")}>
              Cancel
            </Button>
          </Stack>

          <Stack spacing={4}>
            {/* Risk Selection */}
            <Paper sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Select Risks</Typography>
                <Button
                  startIcon={<Plus size={18} />}
                  variant="outlined"
                  size="small"
                  onClick={() => setShowAddRiskModal(true)}
                >
                  Add Custom Risk
                </Button>
              </Stack>
              <Grid container spacing={2}>
                {allRiskTypes.map((risk) => {
                  const isSelected = selectedRisks.includes(risk.id);
                  const Icon =
                    "icon" in risk ? (risk as any).icon : AlertTriangle;
                  const color =
                    "color" in risk ? (risk as any).color : "#94A3B8";
                  return (
                    <Grid size={{ xs: 6, md: 3, lg: 2 }} key={risk.id}>
                      <Paper
                        variant="outlined"
                        onClick={() => handleToggleRisk(risk.id)}
                        sx={{
                          p: 2,
                          cursor: "pointer",
                          borderColor: isSelected ? color : "divider",
                          bgcolor: isSelected
                            ? alpha(color, 0.08)
                            : "transparent",
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          height: "100%",
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between">
                          <Icon size={24} color={isSelected ? color : "gray"} />
                          <Checkbox
                            checked={isSelected}
                            size="small"
                            disableRipple
                          />
                        </Stack>
                        <Typography fontWeight={600} variant="body2">
                          {risk.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>

            {/* Configuration Table */}
            {selectedRisks.length > 0 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Parameters
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell width="20%">Risk Type</TableCell>
                        <TableCell width="25%">Mapping Method(s)</TableCell>
                        <TableCell width="25%">Select Assets</TableCell>
                        <TableCell width="20%">Justification</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedRisks.map((riskId) => {
                        const risk = allRiskTypes.find((r) => r.id === riskId);
                        const config = riskConfigurations[riskId];
                        if (!config) return null;

                        return (
                          <TableRow key={riskId}>
                            <TableCell>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Typography fontWeight={500}>
                                  {risk?.label}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <FormControl fullWidth size="small">
                                <Select
                                  multiple
                                  value={
                                    Array.isArray(config.mappingMethod)
                                      ? config.mappingMethod
                                      : []
                                  }
                                  onChange={(e) =>
                                    handleConfigChange(
                                      riskId,
                                      "mappingMethod",
                                      e.target.value,
                                    )
                                  }
                                  renderValue={(selected: any) => (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 0.5,
                                      }}
                                    >
                                      {selected.map((val: string) => (
                                        <Chip
                                          key={val}
                                          label={
                                            MAPPING_METHODS.find(
                                              (m) => m.value === val,
                                            )?.label || val
                                          }
                                          size="small"
                                        />
                                      ))}
                                    </Box>
                                  )}
                                >
                                  {MAPPING_METHODS.map((m) => (
                                    <MenuItem key={m.value} value={m.value}>
                                      {m.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              <FormControl fullWidth size="small">
                                <Select
                                  multiple
                                  value={config.selectedAssets || []}
                                  onChange={(e) =>
                                    handleConfigChange(
                                      riskId,
                                      "selectedAssets",
                                      e.target.value,
                                    )
                                  }
                                  renderValue={(selected: any) => (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 0.5,
                                      }}
                                    >
                                      {selected.map((val: string) => (
                                        <Chip
                                          key={val}
                                          label={assets[val]?.type || val}
                                          size="small"
                                        />
                                      ))}
                                    </Box>
                                  )}
                                >
                                  {uploadedAssetTypes.map((key) => (
                                    <MenuItem key={key} value={key}>
                                      {assets[key].type}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                size="small"
                                placeholder="Optional note"
                                value={config.justification || ""}
                                onChange={(e) =>
                                  handleConfigChange(
                                    riskId,
                                    "justification",
                                    e.target.value,
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                variant="text"
                                startIcon={<Eye size={16} />}
                                disabled={
                                  !config.mappingMethod?.length ||
                                  !config.selectedAssets?.length
                                }
                                onClick={() => handlePreview(riskId)}
                              >
                                Preview
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  spacing={2}
                  mt={3}
                >
                  <Button
                    startIcon={<Play />}
                    variant="contained"
                    onClick={handleRunAssessment}
                  >
                    Run Assessment
                  </Button>
                </Stack>
              </Paper>
            )}
          </Stack>

          {/* Add Risk Modal */}
          <Dialog
            open={showAddRiskModal}
            onClose={() => setShowAddRiskModal(false)}
          >
            <DialogTitle>Add Custom Physical Risk</DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Define a new physical risk type to include in your assessment.
              </Typography>
              <TextField
                autoFocus
                label="Risk Name"
                fullWidth
                value={newRiskName}
                onChange={(e) => setNewRiskName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowAddRiskModal(false)}>Cancel</Button>
              <Button
                onClick={handleAddCustomRisk}
                variant="contained"
                disabled={!newRiskName.trim()}
              >
                Add
              </Button>
            </DialogActions>
          </Dialog>

          {/* Preview Modal */}
          <Dialog
            open={showPreviewModal}
            onClose={() => setShowPreviewModal(false)}
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle>Preview Scoring Configuration</DialogTitle>
            <DialogContent dividers>
              {previewData && (
                <Stack spacing={3}>
                  <Typography gutterBottom>
                    Previewing mapping for{" "}
                    <b>
                      {
                        allRiskTypes.find((r) => r.id === previewData.riskId)
                          ?.label
                      }
                    </b>
                    . Showing sample scoring distribution based on selected
                    methods.
                  </Typography>
                  {previewData.tables.map((tbl: any, idx: number) => (
                    <Box key={idx}>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          textTransform: "uppercase",
                          color: "text.secondary",
                        }}
                      >
                        Method:{" "}
                        {MAPPING_METHODS.find((m) => m.value === tbl.method)
                          ?.label || tbl.method}
                      </Typography>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                {MAPPING_METHODS.find(
                                  (m) => m.value === tbl.method,
                                )?.label || "Key"}
                              </TableCell>
                              <TableCell>Impact</TableCell>
                              <TableCell>Impact Score</TableCell>
                              <TableCell>Likelihood</TableCell>
                              <TableCell>Likelihood Score</TableCell>
                              <TableCell>Risk Score</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {tbl.data.slice(0, 8).map(
                              (
                                row: any,
                                rIdx: number, // Show first 8 for preview
                              ) => (
                                <TableRow key={rIdx}>
                                  <TableCell>{row.key}</TableCell>
                                  <TableCell>{row.impact}</TableCell>
                                  <TableCell>{row.impactScore}</TableCell>
                                  <TableCell>{row.likelihood}</TableCell>
                                  <TableCell>{row.likelihoodScore}</TableCell>
                                  <TableCell>
                                    <b>{row.riskScore}</b>
                                  </TableCell>
                                </TableRow>
                              ),
                            )}
                            {tbl.data.length > 8 && (
                              <TableRow>
                                <TableCell colSpan={6} align="center">
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    ... {tbl.data.length - 8} more rows
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  ))}
                </Stack>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowPreviewModal(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </CRALayout>
    );
  }

  // 5. Overview / Results
  if (viewMode === "overview") {
    // Current Active Matrix
    const activeItem = allMatrices[activeMatrixTab];

    return (
      <CRALayout>
        <Box sx={{ p: 3, maxWidth: 1600, mx: "auto" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Physical Risk Overview
              </Typography>
              <Typography color="text.secondary">
                Aggregate view of all assessed risks
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                startIcon={<Plus />}
                variant="contained"
                onClick={() => setViewMode("setup")}
              >
                Run New Assessment
              </Button>
            </Stack>
          </Stack>

          {allMatrices.length === 0 ? (
            <Paper sx={{ p: 5, textAlign: "center" }}>
              <Typography color="text.secondary">
                No assessments completed yet.
              </Typography>
            </Paper>
          ) : (
            <Box>
              <Paper sx={{ mb: 3 }}>
                <Tabs
                  value={activeMatrixTab}
                  onChange={(_, v) => setActiveMatrixTab(v)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                  {allMatrices.map((item) => (
                    <Tab
                      key={`${item.riskId}-${item.method}`}
                      label={`${item.riskLabel} (${item.methodLabel})`}
                    />
                  ))}
                </Tabs>

                {/* Active Matrix View */}
                {activeItem && (
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={4}>
                      {/* Left: Matrix */}
                      <Grid size={{ xs: 12, lg: 8 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Typography variant="h6">
                            Risk Matrix: {activeItem.riskLabel}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "#f8fafc",
                            borderRadius: 2,
                            overflow: "auto",
                          }}
                        >
                          {/* Matrix Table */}
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "100px repeat(5, 1fr)",
                              gap: 1,
                              minWidth: 600,
                            }}
                          >
                            {/* Header Row */}
                            <Box /> {/* Empty Top-Left Corner */}
                            {[
                              "Very Low (1)",
                              "Low (2)",
                              "Medium (3)",
                              "High (4)",
                              "Very High (5)",
                            ].map((label) => (
                              <Box
                                key={label}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  p: 1,
                                  fontWeight: "bold",
                                  color: "text.secondary",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {label}
                              </Box>
                            ))}
                            {/* Matrix Rows */}
                            {[
                              { idx: 4, label: "Very High (5)" },
                              { idx: 3, label: "High (4)" },
                              { idx: 2, label: "Medium (3)" },
                              { idx: 1, label: "Low (2)" },
                              { idx: 0, label: "Very Low (1)" },
                            ].map(({ idx: impactIdx, label: rowLabel }) => (
                              <>
                                {/* Row Header */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    pr: 2,
                                    fontWeight: "bold",
                                    color: "text.secondary",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  {rowLabel}
                                </Box>

                                {/* Cells */}
                                {[0, 1, 2, 3, 4].map((likelihoodIdx) => {
                                  const cell =
                                    activeItem.matrix[likelihoodIdx][impactIdx];
                                  const score =
                                    (impactIdx + 1) * (likelihoodIdx + 1);

                                  let bgColor = "#bbf7d0";
                                  if (score >= 20) bgColor = "#fca5a5";
                                  else if (score >= 12) bgColor = "#fdba74";
                                  else if (score >= 6) bgColor = "#fde047";

                                  return (
                                    <Paper
                                      key={`${impactIdx}-${likelihoodIdx}`}
                                      elevation={0}
                                      onClick={() =>
                                        handleCellClick(
                                          likelihoodIdx + 1,
                                          impactIdx + 1,
                                          activeItem.riskId,
                                          activeItem.method,
                                          cell.assets,
                                        )
                                      }
                                      sx={{
                                        bgcolor: alpha(bgColor, 0.7),
                                        border: "1px solid rgba(0,0,0,0.05)",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        aspectRatio: "1/0.8",
                                        cursor:
                                          cell.count > 0
                                            ? "pointer"
                                            : "default",
                                        transition: "all 0.2s",
                                        "&:hover": {
                                          transform: "scale(1.02)",
                                          boxShadow: 2,
                                          zIndex: 1,
                                        },
                                      }}
                                    >
                                      {cell.count > 0 && (
                                        <>
                                          <Typography
                                            fontWeight={800}
                                            variant="h6"
                                          >
                                            {cell.count}
                                          </Typography>
                                          <Typography
                                            variant="caption"
                                            sx={{ fontSize: "0.65rem" }}
                                          >
                                            GH₵
                                            {(cell.exposure / 1000000).toFixed(
                                              1,
                                            )}
                                            M
                                          </Typography>
                                        </>
                                      )}
                                    </Paper>
                                  );
                                })}
                              </>
                            ))}
                          </Box>
                        </Box>

                        <Stack
                          direction="row"
                          justifyContent="center"
                          mt={2}
                          spacing={4}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Y-Axis: <b>Impact Severity</b>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            X-Axis: <b>Likelihood Probability</b>
                          </Typography>
                        </Stack>

                        {/* Legend */}
                        <Stack
                          direction="row"
                          justifyContent="center"
                          mt={2}
                          spacing={3}
                          sx={{
                            p: 1,
                            bgcolor: "background.paper",
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          {[
                            {
                              label: "Very High Risk (20-25)",
                              color: "#fca5a5",
                            },
                            { label: "High Risk (12-16)", color: "#fdba74" },
                            { label: "Medium Risk (6-10)", color: "#fde047" },
                            { label: "Low Risk (1-5)", color: "#bbf7d0" },
                          ].map((item) => (
                            <Stack
                              key={item.label}
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Box
                                sx={{
                                  width: 16,
                                  height: 16,
                                  bgcolor: item.color,
                                  borderRadius: 0.5,
                                  border: "1px solid rgba(0,0,0,0.1)",
                                }}
                              />
                              <Typography variant="caption">
                                {item.label}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Grid>

                      {/* Right: Summary Stats */}
                      <Grid size={{ xs: 12, lg: 4 }}>
                        <Stack spacing={2}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography
                              variant="subtitle2"
                              color="primary"
                              gutterBottom
                            >
                              TOTAL EXPOSURE
                            </Typography>
                            <Typography variant="h4" fontWeight={700}>
                              GH₵{" "}
                              {(
                                activeItem.matrix
                                  .flat()
                                  .reduce(
                                    (sum: number, c: any) => sum + c.exposure,
                                    0,
                                  ) / 1000000
                              ).toFixed(2)}
                              M
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{ mt: 2 }}
                              fullWidth
                              startIcon={<Eye size={16} />}
                              onClick={() => setShowFullDetails(true)}
                            >
                              View Full Details
                            </Button>
                          </Paper>

                          <Paper
                            variant="outlined"
                            sx={{ p: 0, overflow: "hidden" }}
                          >
                            <Box sx={{ p: 2, bgcolor: "#f1f5f9" }}>
                              <Typography variant="subtitle2">
                                Top Hazard Contributors
                              </Typography>
                            </Box>
                            <Table size="small">
                              <TableBody>
                                {[1, 2, 3].map((i) => (
                                  <TableRow key={i}>
                                    <TableCell>Region {i}</TableCell>
                                    <TableCell
                                      align="right"
                                      sx={{ fontWeight: "bold" }}
                                    >
                                      {(25 - i * 5).toFixed(1)}%
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Paper>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Paper>
            </Box>
          )}

          {/* Full Details Modal */}
          <Dialog
            open={showFullDetails}
            onClose={() => setShowFullDetails(false)}
            maxWidth="xl"
            fullWidth
          >
            <DialogTitle>
              {activeItem?.riskLabel} - Assessment Details (
              {activeItem?.methodLabel})
            </DialogTitle>
            <DialogContent dividers>
              <TableContainer sx={{ maxHeight: "70vh" }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Asset Type</TableCell>
                      <TableCell>Borrower / ID</TableCell>
                      <TableCell>Key ({activeItem?.method})</TableCell>
                      <TableCell>Ref Sector</TableCell>
                      <TableCell align="right">Exposure</TableCell>
                      <TableCell align="center">Impact</TableCell>
                      <TableCell align="center">Impact Score</TableCell>
                      <TableCell align="center">Likelihood</TableCell>
                      <TableCell align="center">Likelihood Score</TableCell>
                      <TableCell align="center">Risk Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeItem?.allAssets?.map((asset: any, i: number) => (
                      <TableRow key={i} hover>
                        <TableCell>{asset.assetType || "N/A"}</TableCell>
                        <TableCell>
                          <Stack>
                            <Typography variant="body2" fontWeight={500}>
                              {asset.borrowerName || "N/A"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {asset.facilityId || asset.id}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{asset.key}</TableCell>
                        <TableCell>{asset.sector || "N/A"}</TableCell>
                        <TableCell align="right">
                          {(asset.outstandingBalance || 0).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {asset.impactLabel}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={asset.impactScore}
                            size="small"
                            sx={{
                              bgcolor:
                                asset.impactScore >= 4 ? "#fca5a5" : undefined,
                              fontWeight: "bold",
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {asset.likelihoodLabel}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={asset.likelihoodScore}
                            size="small"
                            sx={{ fontWeight: "bold" }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <b>{asset.riskScore}</b>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowFullDetails(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          {/* Drill Down Modal */}
          <Dialog
            open={!!drillDownCell}
            onClose={() => setDrillDownCell(null)}
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle>
              Details:{" "}
              {drillDownCell &&
                `${MAPPING_METHODS.find((m) => m.value === drillDownCell.method)?.label} Analysis`}
              {drillDownCell && (
                <Typography variant="body2" color="text.secondary">
                  Risk Assessment for{" "}
                  {
                    allRiskTypes.find((r) => r.id === drillDownCell.riskId)
                      ?.label
                  }
                </Typography>
              )}
            </DialogTitle>
            <DialogContent dividers>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Asset ID</TableCell>
                      <TableCell>Borrower</TableCell>
                      <TableCell>Key ({drillDownCell?.method})</TableCell>
                      <TableCell align="right">Exposure (GH₵)</TableCell>
                      <TableCell align="center">Impact</TableCell>
                      <TableCell align="center">Likelihood</TableCell>
                      <TableCell align="center">Risk Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {drillDownCell?.assets.map((asset: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{asset.facilityId || asset.id}</TableCell>
                        <TableCell>{asset.borrowerName || "N/A"}</TableCell>
                        {/* Determine key based on method */}
                        <TableCell>
                          {drillDownCell.method === "location"
                            ? asset.location || asset.region
                            : drillDownCell.method === "region"
                              ? asset.region
                              : asset.sector}
                        </TableCell>
                        <TableCell align="right">
                          {(asset.outstandingBalance || 0).toLocaleString()}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={asset.impactScore}
                            size="small"
                            color={asset.impactScore >= 4 ? "error" : "default"}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={asset.likelihoodScore} size="small" />
                        </TableCell>
                        <TableCell align="center">
                          <b>{asset.riskScore}</b>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDrillDownCell(null)}>Close</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </CRALayout>
    );
  }

  return null;
}
