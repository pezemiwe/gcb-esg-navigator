import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Paper, Box, Typography, useTheme, Grid, alpha } from "@mui/material";
import { GCB_COLORS } from "@/config/colors.config";
interface SectorBreakdownChartProps {
  sectorBreakdown: Array<{
    sector: string;
    baselineECL: number;
    stressedECL: number;
    deltaECL: number;
    percentIncrease: number;
  }>;
}
const SECTOR_COLORS: Record<string, string> = {
  "Oil & Gas": alpha(GCB_COLORS.error, 0.9),
  "Coal Mining": "#4A4A4A",
  "Electricity Generation": alpha(GCB_COLORS.gold.DEFAULT, 0.9),
  "Cement & Construction": "#FFA500",
  "Real Estate": alpha(GCB_COLORS.slate.DEFAULT, 0.9),
  "Financial Services": GCB_COLORS.info,
  Technology: "#9C27B0",
  Agriculture: "#8BC34A",
  Healthcare: "#00BCD4",
  "Air Transport": "#FF9800",
};
const formatCurrency = (value: number): string => {
  return `GHS ${(value / 1000000).toFixed(1)}M`;
};
const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Paper elevation={3} sx={{ p: 2, bgcolor: "background.paper" }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {data.sector}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            Baseline: {formatCurrency(data.baselineECL)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stressed: {formatCurrency(data.stressedECL)}
          </Typography>
          <Typography variant="body2" color="error.main" fontWeight={600}>
            ΔECL: {formatCurrency(data.deltaECL)} (+
            {data.percentIncrease.toFixed(1)}%)
          </Typography>
        </Box>
      </Paper>
    );
  }
  return null;
};
export const SectorBreakdownChart: React.FC<SectorBreakdownChartProps> = ({
  sectorBreakdown,
}) => {
  const theme = useTheme();
  const sortedData = [...sectorBreakdown].sort(
    (a, b) => b.deltaECL - a.deltaECL,
  );
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          <span style={{ marginRight: 8, fontSize: "1.2rem" }}>📊</span>
          ECL Impact by Sector
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Expected Credit Loss increase (ΔECL) across economic sectors - Ghana
          portfolio
        </Typography>
      </Box>
      <Box sx={{ width: "100%", height: 500 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              label={{
                value: "ΔECL (GHS millions)",
                position: "insideBottom",
                offset: -10,
                style: { fill: theme.palette.text.secondary },
              }}
              tick={{ fill: theme.palette.text.secondary }}
            />
            <YAxis
              type="category"
              dataKey="sector"
              width={140}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar
              dataKey="deltaECL"
              name="ECL Increase (ΔECL)"
              radius={[0, 4, 4, 0]}
              barSize={20}
            >
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={SECTOR_COLORS[entry.sector] || GCB_COLORS.slate.light}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: 2,
          bgcolor: alpha(GCB_COLORS.gold.DEFAULT, 0.1),
          borderRadius: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          color={GCB_COLORS.gold.dark}
          gutterBottom
          fontWeight={600}
        >
          Top 3 Most Impacted Sectors:
        </Typography>
        <Grid container spacing={2}>
          {sortedData.slice(0, 3).map((sector, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={sector.sector}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  bgcolor: "background.paper",
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    bgcolor: GCB_COLORS.gold.DEFAULT,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {index + 1}
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {sector.sector}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatCurrency(sector.deltaECL)} (+
                    {sector.percentIncrease.toFixed(0)}%)
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 2,
          bgcolor: alpha(GCB_COLORS.error, 0.1),
          borderLeft: `4px solid ${GCB_COLORS.error}`,
        }}
      >
        <Typography variant="subtitle2" color="error.main" gutterBottom>
          ⚠️ High-Carbon Exposure:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Oil & Gas, Coal Mining, and Electricity Generation represent 47% of
          total portfolio exposure (GHS 5.7B) and face elevated transition risk
          under all NGFS scenarios. Diversification and transition finance
          strategies recommended.
        </Typography>
      </Paper>
    </Paper>
  );
};
