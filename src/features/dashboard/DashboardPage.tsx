import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Paper,
  Stack,
  alpha,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import DashboardNavbar from "@/components/layout/DashboardNavbar/DashboardNavbar";
import { useAuthStore } from "@/store/authStore";
import { useCRADataStore } from "@/store/craStore";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ArrowRight,
  Download,
  ChevronRight,
  BarChart3,
  Database,
  Shield,
  Globe,
  Building,
  FileText,
  PieChart,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CORPORATE_COLORS = {
  primary: "#0F172A", // Professional dark navy
  primaryLight: "#1E293B",
  secondary: "#FDB913", // Accent gold
  accent: "#059669", // Deep emerald green
  success: "#10B981", // Success green
  warning: "#F59E0B", // Warning amber
  error: "#DC2626", // Error red
  info: "#3B82F6", // Info blue
  neutral: "#64748B",
  lightBg: "#F8FAFC",
  darkBg: "#0F172A",
  cardBorder: "#E2E8F0",
  highlight: "#2563EB",
};

interface Module {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: React.ElementType;
  category: string;
  completion: number;
}

const modules: Module[] = [
  {
    id: "data-upload",
    title: "CRA Data Setup",
    description:
      "Centralized data ingestion and validation for portfolio analysis",
    route: "/cra/data",
    icon: Database,
    category: "Core System",
    completion: 85,
  },
  {
    id: "segmentation",
    title: "Portfolio Segmentation",
    description: "Advanced sector and geographic risk exposure analysis",
    route: "/cra/segmentation",
    icon: PieChart,
    category: "Analytics",
    completion: 100,
  },
  {
    id: "physical-risk",
    title: "Physical Risk Assessment",
    description: "Comprehensive climate hazard modeling and impact analysis",
    route: "/cra/physical-risk",
    icon: Globe,
    category: "Risk Analysis",
    completion: 65,
  },
  {
    id: "transition-risk",
    title: "Transition Risk Assessment",
    description: "Policy, technology and market transition scenario analysis",
    route: "/cra/transition-risk",
    icon: Shield,
    category: "Strategy",
    completion: 45,
  },
  {
    id: "collateral",
    title: "Collateral Sensitivity",
    description: "Climate impact assessment on asset valuations and collateral",
    route: "/cra/collateral",
    icon: Building,
    category: "Valuation",
    completion: 30,
  },
  {
    id: "reporting",
    title: "CRA Reporting",
    description: "Regulatory compliance and stakeholder reporting suite",
    route: "/cra/reporting",
    icon: FileText,
    category: "Compliance",
    completion: 90,
  },
];

// Enhanced sector data
const sectorExposure = [
  {
    sector: "Agriculture",
    exposure: 450,
    risk: "High",
    trend: "+12%",
    color: CORPORATE_COLORS.error,
  },
  {
    sector: "Energy",
    exposure: 320,
    risk: "Medium",
    trend: "+8%",
    color: CORPORATE_COLORS.warning,
  },
  {
    sector: "Transport",
    exposure: 280,
    risk: "High",
    trend: "+15%",
    color: CORPORATE_COLORS.error,
  },
  {
    sector: "Real Estate",
    exposure: 210,
    risk: "Medium",
    trend: "+5%",
    color: CORPORATE_COLORS.warning,
  },
  {
    sector: "Manufacturing",
    exposure: 180,
    risk: "Low",
    trend: "+3%",
    color: CORPORATE_COLORS.success,
  },
  {
    sector: "Infrastructure",
    exposure: 150,
    risk: "Medium",
    trend: "+7%",
    color: CORPORATE_COLORS.warning,
  },
];

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  suffix?: string;
  description?: string;
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive,
  suffix,
  description,
  icon,
}) => (
  <Card
    elevation={0}
    sx={{
      backgroundColor: "background.paper",
      borderRadius: "4px",
      border: "1px solid",
      borderColor: "divider",
      height: "100%",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      overflow: "hidden",
      "&:hover": {
        borderColor: CORPORATE_COLORS.primary,
        boxShadow: "0 6px 24px rgba(0, 0, 0, 0.08)",
      },
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "3px",
        backgroundColor: isPositive
          ? CORPORATE_COLORS.success
          : CORPORATE_COLORS.error,
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Stack spacing={2.5}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              fontSize: "0.75rem",
            }}
          >
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "4px",
                backgroundColor: alpha(CORPORATE_COLORS.primary, 0.08),
                color: CORPORATE_COLORS.primary,
              }}
            >
              {icon}
            </Box>
          )}
        </Stack>

        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1,
              letterSpacing: "-0.5px",
            }}
          >
            {value}
          </Typography>
          {suffix && (
            <Typography
              variant="subtitle1"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              {suffix}
            </Typography>
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 24,
              height: 24,
              borderRadius: "4px",
              backgroundColor: isPositive
                ? alpha(CORPORATE_COLORS.success, 0.1)
                : alpha(CORPORATE_COLORS.error, 0.1),
              color: isPositive
                ? CORPORATE_COLORS.success
                : CORPORATE_COLORS.error,
            }}
          >
            {isPositive ? (
              <TrendingUpIcon size={14} />
            ) : (
              <TrendingDownIcon size={14} />
            )}
          </Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: isPositive
                ? CORPORATE_COLORS.success
                : CORPORATE_COLORS.error,
              fontSize: "0.75rem",
            }}
          >
            {change}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.disabled",
              fontSize: "0.75rem",
            }}
          >
            vs last quarter
          </Typography>
        </Stack>

        {description && (
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: "0.75rem",
              lineHeight: 1.5,
            }}
          >
            {description}
          </Typography>
        )}
      </Stack>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { assets } = useCRADataStore();
  const navigate = useNavigate();

  const [selectedTimeframe, setSelectedTimeframe] = useState("quarterly");

  if (!user) return null;

  const uploadedAssetTypes = Object.keys(assets).length;
  const totalRecords = Object.values(assets).reduce(
    (sum, asset) => sum + asset.rowCount,
    0,
  );
  const totalExposure = Object.values(assets).reduce(
    (sum, asset) =>
      sum + asset.data.reduce((s, a) => s + (a.outstandingBalance || 0), 0),
    0,
  );

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `₵${(value / 1000000000).toFixed(1)}`;
    }
    if (value >= 1000000) {
      return `₵${(value / 1000000).toFixed(1)}`;
    }
    return `₵${value.toLocaleString()}`;
  };

  const getCurrencySuffix = (value: number) => {
    if (value >= 1000000000) return "B";
    if (value >= 1000000) return "M";
    return "";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        pt: "70px",
      }}
    >
      <DashboardNavbar />

      <Box sx={{ maxWidth: 1600, mx: "auto", px: { xs: 2, md: 4 }, py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Card
            elevation={0}
            sx={{
              backgroundColor: alpha(CORPORATE_COLORS.primary, 0.03),
              border: `1px solid ${alpha(CORPORATE_COLORS.primary, 0.1)}`,
              borderRadius: "4px",
              p: 3,
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
              spacing={3}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: "text.primary",
                    fontWeight: 700,
                    fontSize: { xs: "1.75rem", md: "2rem" },
                    mb: 0.5,
                  }}
                >
                  Hi, {user.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Welcome to GCB ESG Navigator!
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl size="medium" sx={{ minWidth: 140 }}>
                  <Select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 500,
                      height: 40,
                      borderRadius: "4px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      backgroundColor: alpha(CORPORATE_COLORS.primary, 0.05),
                    }}
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  startIcon={<Download size={16} />}
                  size="medium"
                  sx={{
                    backgroundColor: CORPORATE_COLORS.primary,
                    color: "#FFFFFF",
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: "4px",
                    px: 3,
                    minWidth: 140,
                    "&:hover": {
                      backgroundColor: CORPORATE_COLORS.primaryLight,
                      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
                    },
                  }}
                >
                  Export Report
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Box>

        {/* Key Metrics Grid - Enhanced */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 6,
          }}
        >
          <MetricCard
            title="Total Portfolio Exposure"
            value={formatCurrency(totalExposure)}
            suffix={getCurrencySuffix(totalExposure)}
            change="+11.1%"
            isPositive={true}
            description="Total outstanding balance across all assessed assets"
            icon={<BarChart3 size={18} />}
          />
          <MetricCard
            title="Portfolio Records"
            value={totalRecords.toLocaleString()}
            change="+8.5%"
            isPositive={true}
            description="Total number of asset records in the system"
            icon={<Database size={18} />}
          />
          <MetricCard
            title="Asset Classes"
            value={uploadedAssetTypes.toString()}
            change="+3.0%"
            isPositive={true}
            description="Number of distinct asset types analyzed"
            icon={<PieChart size={18} />}
          />
          <MetricCard
            title="Average Risk Score"
            value="7.2"
            change="-2.3%"
            isPositive={false}
            suffix="/10"
            description="Weighted average climate risk score across portfolio"
            icon={<AlertTriangle size={18} />}
          />
        </Box>

        {/* Enhanced Module Cards Section */}
        <Box sx={{ mb: 6 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 4 }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  mb: 1,
                }}
              >
                Risk Assessment Modules
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                }}
              >
                Professional tools for comprehensive climate risk analysis and
                reporting
              </Typography>
            </Box>
            <Button
              variant="text"
              endIcon={<ChevronRight size={16} />}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                color: CORPORATE_COLORS.primary,
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: alpha(CORPORATE_COLORS.primary, 0.05),
                },
              }}
              onClick={() => navigate("/modules")}
            >
              View All Modules
            </Button>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {modules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Card
                  key={module.id}
                  elevation={0}
                  sx={{
                    backgroundColor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: "4px",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      borderColor: CORPORATE_COLORS.primary,
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
                      "& .module-arrow": {
                        transform: "translateX(4px)",
                      },
                    },
                  }}
                  onClick={() => navigate(module.route)}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <Stack spacing={3} sx={{ flex: 1 }}>
                      <Stack
                        direction="row"
                        alignItems="flex-start"
                        justifyContent="space-between"
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 48,
                            height: 48,
                            borderRadius: "4px",
                            backgroundColor: alpha(
                              CORPORATE_COLORS.primary,
                              0.08,
                            ),
                            color: CORPORATE_COLORS.primary,
                          }}
                        >
                          <IconComponent size={22} />
                        </Box>
                        <Chip
                          label={module.category}
                          size="small"
                          sx={{
                            backgroundColor: alpha(
                              CORPORATE_COLORS.primary,
                              0.08,
                            ),
                            color: CORPORATE_COLORS.primary,
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            height: 24,
                            borderRadius: "4px",
                          }}
                        />
                      </Stack>

                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "text.primary",
                            mb: 1.5,
                            fontSize: "1.125rem",
                          }}
                        >
                          {module.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            lineHeight: 1.6,
                            fontSize: "0.875rem",
                          }}
                        >
                          {module.description}
                        </Typography>
                      </Box>

                      <Divider sx={{ borderColor: "divider" }} />

                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: CORPORATE_COLORS.primary,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Access Module
                        </Typography>
                        <Box
                          className="module-arrow"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 32,
                            height: 32,
                            borderRadius: "4px",
                            backgroundColor: alpha(
                              CORPORATE_COLORS.primary,
                              0.1,
                            ),
                            color: CORPORATE_COLORS.primary,
                            transition: "transform 0.2s ease",
                          }}
                        >
                          <ArrowRight size={16} />
                        </Box>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Box>

        {/* Enhanced Sector Exposure Section */}
        <Card
          elevation={0}
          sx={{
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "4px",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  mb: 0.5,
                }}
              >
                Sector Exposure Analysis
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                }}
              >
                Risk distribution and exposure values across economic sectors
              </Typography>
            </Box>

            <Box
              sx={{
                p: 3,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              {sectorExposure.map((sector) => (
                <Box key={sector.sector}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      backgroundColor: "background.paper",
                      border: "1px solid",
                      borderColor: alpha(sector.color, 0.2),
                      borderRadius: "4px",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: sector.color,
                        backgroundColor: alpha(sector.color, 0.02),
                      },
                    }}
                  >
                    <Stack spacing={2}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: "text.primary",
                            fontSize: "0.875rem",
                          }}
                        >
                          {sector.sector}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: sector.color,
                              fontWeight: 600,
                              fontSize: "0.7rem",
                            }}
                          >
                            {sector.trend}
                          </Typography>
                          <Chip
                            label={sector.risk}
                            size="small"
                            sx={{
                              backgroundColor: alpha(sector.color, 0.1),
                              color: sector.color,
                              fontWeight: 600,
                              fontSize: "0.7rem",
                              height: 22,
                              borderRadius: "4px",
                            }}
                          />
                        </Box>
                      </Stack>

                      <Stack direction="row" alignItems="baseline" spacing={1}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            color: "text.primary",
                            letterSpacing: "-0.5px",
                          }}
                        >
                          ₵{sector.exposure}M
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.disabled",
                          }}
                        >
                          exposure
                        </Typography>
                      </Stack>

                      <Divider sx={{ borderColor: alpha(sector.color, 0.1) }} />

                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontSize: "0.75rem",
                        }}
                      >
                        Sector risk assessment based on climate exposure and
                        financial impact
                      </Typography>
                    </Stack>
                  </Paper>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Footer with Quick Actions */}
        <Box
          sx={{ mt: 4, pt: 3, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
              }}
            >
              © ESG Climate Risk Platform • Last updated: Today at 14:30 GMT
            </Typography>
            <Stack direction="row" spacing={2}>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                }}
              >
                Data refresh: 24 hours
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                }}
              >
                Version: 3.2.1
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
