import React, { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
  useTheme,
  Grid,
} from "@mui/material";
import { Info } from "lucide-react";
import { GCB_COLORS } from "@/config/colors.config";
interface RegionData {
  name: string;
  totalEAD: number;
  loanCount: number;
  deltaECL: number;
  dominantSector: string;
  physicalRisks: string[];
  coordinates: { x: number; y: number };
}
interface GhanaRiskMapProps {
  results?: {
    regionBreakdown: RegionData[];
  };
  className?: string; 
}
const GHANA_REGIONS = [
  {
    name: "Greater Accra",
    path: "M 380,280 L 420,270 L 430,290 L 410,310 L 380,300 Z",
    totalEAD: 4720000000,
    loanCount: 42,
    deltaECL: 185000000,
    dominantSector: "Financial Services",
    physicalRisks: ["Coastal Flooding", "Sea Level Rise", "Storm Surge"],
    centroid: { x: 405, y: 290 },
  },
  {
    name: "Western",
    path: "M 200,300 L 260,280 L 280,320 L 250,360 L 200,340 Z",
    totalEAD: 1900000000,
    loanCount: 16,
    deltaECL: 92000000,
    dominantSector: "Oil & Gas",
    physicalRisks: ["Offshore Flooding", "Coastal Erosion", "Cyclones"],
    centroid: { x: 240, y: 320 },
  },
  {
    name: "Ashanti",
    path: "M 280,200 L 340,180 L 360,220 L 330,250 L 280,240 Z",
    totalEAD: 1580000000,
    loanCount: 12,
    deltaECL: 68000000,
    dominantSector: "Coal Mining",
    physicalRisks: ["Drought", "Water Stress", "Heat Waves"],
    centroid: { x: 320, y: 220 },
  },
  {
    name: "Eastern",
    path: "M 360,220 L 410,210 L 420,250 L 390,270 L 360,260 Z",
    totalEAD: 980000000,
    loanCount: 9,
    deltaECL: 42000000,
    dominantSector: "Agriculture",
    physicalRisks: ["Drought", "Irregular Rainfall", "Pest Outbreaks"],
    centroid: { x: 390, y: 240 },
  },
  {
    name: "Volta",
    path: "M 420,250 L 470,240 L 480,280 L 450,300 L 420,290 Z",
    totalEAD: 850000000,
    loanCount: 8,
    deltaECL: 38000000,
    dominantSector: "Electricity Generation",
    physicalRisks: ["Drought (Hydro Risk)", "Flooding", "Dam Stress"],
    centroid: { x: 450, y: 270 },
  },
  {
    name: "Northern",
    path: "M 260,80 L 340,70 L 360,120 L 320,150 L 260,140 Z",
    totalEAD: 720000000,
    loanCount: 7,
    deltaECL: 34000000,
    dominantSector: "Agriculture",
    physicalRisks: ["Severe Drought", "Desertification", "Wildfires"],
    centroid: { x: 310, y: 110 },
  },
  {
    name: "Central",
    path: "M 280,240 L 330,250 L 340,280 L 310,300 L 280,290 Z",
    totalEAD: 650000000,
    loanCount: 6,
    deltaECL: 28000000,
    dominantSector: "Real Estate",
    physicalRisks: ["Coastal Flooding", "Erosion", "Storm Damage"],
    centroid: { x: 310, y: 270 },
  },
  {
    name: "Brong-Ahafo",
    path: "M 240,150 L 300,140 L 320,180 L 280,200 L 240,190 Z",
    totalEAD: 550000000,
    loanCount: 5,
    deltaECL: 24000000,
    dominantSector: "Agriculture",
    physicalRisks: ["Drought", "Irregular Rainfall", "Heat Stress"],
    centroid: { x: 280, y: 170 },
  },
  {
    name: "Upper East",
    path: "M 340,50 L 400,45 L 410,85 L 370,100 L 340,90 Z",
    totalEAD: 380000000,
    loanCount: 3,
    deltaECL: 18000000,
    dominantSector: "Agriculture",
    physicalRisks: ["Extreme Drought", "Desertification", "Food Insecurity"],
    centroid: { x: 375, y: 70 },
  },
  {
    name: "Upper West",
    path: "M 200,60 L 260,55 L 270,95 L 230,110 L 200,100 Z",
    totalEAD: 470000000,
    loanCount: 4,
    deltaECL: 21000000,
    dominantSector: "Agriculture",
    physicalRisks: ["Severe Drought", "Desertification", "Heat Waves"],
    centroid: { x: 235, y: 82 },
  },
];
export const GhanaRiskMap: React.FC<GhanaRiskMapProps> = () => {
  const theme = useTheme();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const getRegionColor = (deltaECL: number): string => {
    if (deltaECL < 30000000) return GCB_COLORS.success;
    if (deltaECL < 60000000) return GCB_COLORS.warning;
    if (deltaECL < 100000000) return "#fb923c"; 
    return GCB_COLORS.error;
  };
  const getRegionOpacity = (regionName: string): number => {
    if (hoveredRegion === regionName || selectedRegion === regionName) return 1;
    if (hoveredRegion || selectedRegion) return 0.4;
    return 0.8;
  };
  const formatCurrency = (value: number): string => {
    return `GHS ${(value / 1000000).toFixed(0)}M`;
  };
  const activeRegion = selectedRegion || hoveredRegion;
  const regionData = GHANA_REGIONS.find((r) => r.name === activeRegion);
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          <span style={{ marginRight: 8, fontSize: "1.2rem" }}>🗺️</span>
          Ghana Climate Risk Map
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Geographic distribution of climate-related credit risk - ΔECL by
          region
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box
            sx={{
              width: "100%",
              maxHeight: 500,
              bgcolor: alpha(GCB_COLORS.gold.DEFAULT, 0.05),
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              overflow: "hidden",
            }}
          >
            <svg
              viewBox="0 0 600 400"
              style={{ width: "100%", height: "100%" }}
            >
              <text
                x="300"
                y="25"
                textAnchor="middle"
                fill={theme.palette.text.primary}
                style={{ fontSize: 14, fontWeight: "bold" }}
              >
                Republic of Ghana - Climate Risk Exposure
              </text>
              {GHANA_REGIONS.map((region) => (
                <g key={region.name}>
                  <path
                    d={region.path}
                    fill={getRegionColor(region.deltaECL)}
                    stroke={theme.palette.text.secondary}
                    strokeWidth="1.5"
                    opacity={getRegionOpacity(region.name)}
                    style={{
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={() => setHoveredRegion(region.name)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() =>
                      setSelectedRegion(
                        selectedRegion === region.name ? null : region.name,
                      )
                    }
                  />
                  <text
                    x={region.centroid.x}
                    y={region.centroid.y}
                    textAnchor="middle"
                    pointerEvents="none"
                    fill={theme.palette.common.black}
                    style={{ fontSize: 10, fontWeight: 600 }}
                  >
                    {region.name}
                  </text>
                  <circle
                    cx={region.centroid.x}
                    cy={region.centroid.y + 15}
                    r={Math.sqrt(region.totalEAD / 200000000)}
                    fill={GCB_COLORS.gold.DEFAULT}
                    opacity="0.5"
                    pointerEvents="none"
                  />
                </g>
              ))}
              <g transform="translate(20, 340)">
                <text
                  x="0"
                  y="0"
                  fill={theme.palette.text.secondary}
                  display="block"
                  style={{ fontSize: 12, fontWeight: 600 }}
                >
                  Risk Level (ΔECL):
                </text>
                {[
                  { x: 0, color: GCB_COLORS.success, label: "<30M" },
                  { x: 90, color: GCB_COLORS.warning, label: "30-60M" },
                  { x: 180, color: "#fb923c", label: "60-100M" },
                  { x: 270, color: GCB_COLORS.error, label: ">100M" },
                ].map((item, idx) => (
                  <g key={idx}>
                    <rect
                      x={item.x}
                      y="5"
                      width="30"
                      height="15"
                      fill={item.color}
                      stroke={theme.palette.text.secondary}
                    />
                    <text
                      x={item.x + 35}
                      y="17"
                      fill={theme.palette.text.secondary}
                      style={{ fontSize: 10 }}
                    >
                      {item.label}
                    </text>
                  </g>
                ))}
              </g>
              <g transform="translate(420, 340)">
                <text
                  x="0"
                  y="0"
                  fill={theme.palette.text.secondary}
                  style={{ fontSize: 12, fontWeight: 600 }}
                >
                  Exposure (EAD):
                </text>
                <circle
                  cx="15"
                  cy="15"
                  r="8"
                  fill={GCB_COLORS.gold.DEFAULT}
                  opacity="0.3"
                  stroke={theme.palette.text.secondary}
                />
                <text
                  x="30"
                  y="18"
                  fill={theme.palette.text.secondary}
                  style={{ fontSize: 10 }}
                >
                  Circle size ∝ √EAD
                </text>
              </g>
            </svg>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          {regionData ? (
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: "100%",
                bgcolor: "background.paper",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" fontWeight={700} gutterBottom>
                {regionData.name}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Exposure (EAD)
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {formatCurrency(regionData.totalEAD)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Number of Loans
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {regionData.loanCount}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Climate Risk Impact (ΔECL)
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color={GCB_COLORS.error}
                  >
                    +{formatCurrency(regionData.deltaECL)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(
                      (regionData.deltaECL / regionData.totalEAD) *
                      100
                    ).toFixed(2)}
                    % of regional EAD
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Dominant Sector
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {regionData.dominantSector}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 1, display: "block" }}
                  >
                    Physical Risk Factors
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {regionData.physicalRisks.map((risk) => (
                      <Box
                        key={risk}
                        sx={{
                          bgcolor: alpha(GCB_COLORS.warning, 0.1),
                          color: GCB_COLORS.warning,
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          border: `1px solid ${alpha(GCB_COLORS.warning, 0.2)}`,
                        }}
                      >
                        ⚠️ {risk}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Paper>
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.action.disabled, 0.05),
                p: 4,
                textAlign: "center",
              }}
            >
              <Box>
                <Info
                  size={32}
                  color={theme.palette.text.disabled}
                  style={{ marginBottom: 8 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Click on a region to view details
                </Typography>
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Regional Risk Ranking
        </Typography>
        <TableContainer component={Paper} elevation={0} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{ bgcolor: alpha(theme.palette.action.disabled, 0.05) }}
              >
                <TableCell>Rank</TableCell>
                <TableCell>Region</TableCell>
                <TableCell align="right">EAD</TableCell>
                <TableCell align="right">Loans</TableCell>
                <TableCell align="right">ΔECL</TableCell>
                <TableCell align="right">Risk %</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...GHANA_REGIONS]
                .sort((a, b) => b.deltaECL - a.deltaECL)
                .map((region, index) => (
                  <TableRow
                    key={region.name}
                    hover
                    onClick={() => setSelectedRegion(region.name)}
                    sx={{ cursor: "pointer" }}
                    selected={selectedRegion === region.name}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>{index + 1}</TableCell>
                    <TableCell>{region.name}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(region.totalEAD)}
                    </TableCell>
                    <TableCell align="right">{region.loanCount}</TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: GCB_COLORS.error, fontWeight: 600 }}
                    >
                      +{formatCurrency(region.deltaECL)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: "text.secondary" }}>
                      {((region.deltaECL / region.totalEAD) * 100).toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: 2,
          bgcolor: alpha(GCB_COLORS.slate.DEFAULT, 0.1),
          borderLeft: `4px solid ${GCB_COLORS.slate.DEFAULT}`,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ color: GCB_COLORS.slate.DEFAULT }}
          gutterBottom
        >
          🌍 Geographic Insights:
        </Typography>
        <Typography
          component="ul"
          variant="body2"
          color="text.secondary"
          sx={{ pl: 2, m: 0 }}
        >
          <li>
            <Typography component="span" fontWeight={600}>
              Greater Accra:{" "}
            </Typography>
            Largest exposure (40% of portfolio) with coastal flood risk from sea
            level rise - financial services concentration
          </li>
          <li>
            <Typography component="span" fontWeight={600}>
              Western Region:{" "}
            </Typography>
            Oil & Gas hub (offshore Jubilee/TEN fields) facing transition risk +
            coastal erosion physical risk
          </li>
          <li>
            <Typography component="span" fontWeight={600}>
              Northern Regions:{" "}
            </Typography>
            Agriculture-heavy with severe drought risk - diversification and
            climate-smart agriculture financing recommended
          </li>
          <li>
            <Typography component="span" fontWeight={600}>
              Volta Region:{" "}
            </Typography>
            Hydropower concentration vulnerable to drought impacts on dam
            operations (Akosombo, Bui)
          </li>
        </Typography>
      </Paper>
    </Paper>
  );
};