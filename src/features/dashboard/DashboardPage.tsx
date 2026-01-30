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
  Tooltip,
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Professional Corporate Color Scheme
const CORPORATE_COLORS = {
  primary: "#0F172A", // Professional navy/dark blue
  primaryLight: "#334155",
  secondary: "#FDB913", // Gold accent
  success: "#059669", // Deep green
  warning: "#D97706", // Amber
  error: "#DC2626", // Deep red
  info: "#2563EB", // Corporate blue
  neutral: "#64748B",
  lightBg: "#F8FAFC",
  darkBg: "#0F172A",
  cardLight: "#FFFFFF",
  cardDark: "#1E293B",
};

interface Module {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: React.ElementType;
  tag?: string;
}

const modules: Module[] = [
  {
    id: "data-upload",
    title: "Data Management",
    description: "Centralized data ingestion and validation for portfolio analysis",
    route: "/cra/data",
    icon: Database,
    tag: "Core",
  },
  {
    id: "segmentation",
    title: "Portfolio Segmentation",
    description: "Advanced sector and geographic risk exposure analysis",
    route: "/cra/segmentation",
    icon: BarChart3,
    tag: "Analytics",
  },
  {
    id: "physical-risk",
    title: "Physical Risk Assessment",
    description: "Comprehensive climate hazard modeling and impact analysis",
    route: "/cra/physical-risk",
    icon: Globe,
    tag: "Risk",
  },
  {
    id: "transition-risk",
    title: "Transition Risk Assessment",
    description: "Policy, technology, and market transition scenario analysis",
    route: "/cra/transition-risk",
    icon: Shield,
    tag: "Strategy",
  },
  {
    id: "collateral",
    title: "Collateral Sensitivity",
    description: "Climate impact assessment on asset valuations and collateral",
    route: "/cra/collateral",
    icon: Building,
    tag: "Valuation",
  },
  {
    id: "reporting",
    title: "CRA Reporting",
    description: "Regulatory compliance and stakeholder reporting suite",
    route: "/cra/reporting",
    icon: FileText,
    tag: "Compliance",
  },
];

// Mock sector data
const sectorExposure = [
  { sector: "Agriculture & Forestry", exposure: 450, risk: "High", trend: "+12%" },
  { sector: "Energy & Utilities", exposure: 320, risk: "Medium", trend: "+8%" },
  { sector: "Transport & Infrastructure", exposure: 280, risk: "High", trend: "+15%" },
  { sector: "Real Estate & Construction", exposure: 210, risk: "Medium", trend: "+5%" },
  { sector: "Manufacturing", exposure: 180, risk: "Low", trend: "+3%" },
  { sector: "Financial Services", exposure: 150, risk: "Medium", trend: "+7%" },
];

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  suffix?: string;
  icon?: React.ReactNode;
  tooltip?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  isPositive, 
  suffix,
  tooltip 
}) => (
  <Tooltip title={tooltip || ""} arrow placement="top">
    <Card
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography
            variant="subtitle2"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              fontSize: '0.75rem',
            }}
          >
            {title}
          </Typography>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                lineHeight: 1,
              }}
            >
              {value}
            </Typography>
            {suffix && (
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                {suffix}
              </Typography>
            )}
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: isPositive ? CORPORATE_COLORS.success : CORPORATE_COLORS.error,
              }}
            >
              {isPositive ? (
                <TrendingUpIcon size={16} />
              ) : (
                <TrendingDownIcon size={16} />
              )}
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  ml: 0.5,
                  color: isPositive ? CORPORATE_COLORS.success : CORPORATE_COLORS.error,
                }}
              >
                {change}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
              }}
            >
              vs. last quarter
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  </Tooltip>
);

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { assets } = useCRADataStore();
  const navigate = useNavigate();

  const [selectedTimeframe, setSelectedTimeframe] = useState('quarterly');

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
    if (value >= 1000000000) return 'B';
    if (value >= 1000000) return 'M';
    return '';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        pt: '70px', // Fixed navbar height
      }}
    >
      <DashboardNavbar />

      <Box sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                ESG & Climate Risk Analytics
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  lineHeight: 1.2,
                }}
              >
                Portfolio Risk Dashboard
              </Typography>
            </Box>

            <Stack
              direction={{ xs: 'column', md: 'row' }}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              justifyContent="space-between"
              spacing={3}
            >
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                  }}
                >
                  Welcome, {user.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: 600,
                  }}
                >
                  Comprehensive overview of climate-related financial risks across your investment portfolio
                </Typography>
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  variant={selectedTimeframe === 'monthly' ? 'contained' : 'outlined'}
                  size="medium"
                  onClick={() => setSelectedTimeframe('monthly')}
                  sx={{
                    minWidth: 100,
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 1,
                  }}
                >
                  Monthly
                </Button>
                <Button
                  variant={selectedTimeframe === 'quarterly' ? 'contained' : 'outlined'}
                  size="medium"
                  onClick={() => setSelectedTimeframe('quarterly')}
                  sx={{
                    minWidth: 100,
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 1,
                  }}
                >
                  Quarterly
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Download size={18} />}
                  size="medium"
                  sx={{
                    backgroundColor: CORPORATE_COLORS.primary,
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 1,
                    px: 3,
                    '&:hover': {
                      backgroundColor: CORPORATE_COLORS.primaryLight,
                    },
                  }}
                >
                  Export Report
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        {/* Key Metrics Grid */}
        <Box
          sx={{
            mb: 6,
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          <MetricCard
            title="Total Portfolio Exposure"
            value={formatCurrency(totalExposure)}
            suffix={getCurrencySuffix(totalExposure)}
            change="+11.1%"
            isPositive={true}
            tooltip="Total outstanding balance across all assessed assets"
          />
          <MetricCard
            title="Portfolio Records"
            value={totalRecords.toLocaleString()}
            change="+8.5%"
            isPositive={true}
            tooltip="Total number of asset records in the system"
          />
          <MetricCard
            title="Asset Classes"
            value={uploadedAssetTypes.toString()}
            change="+3.0%"
            isPositive={true}
            tooltip="Number of distinct asset types analyzed"
          />
          <MetricCard
            title="Average Risk Score"
            value="7.2"
            change="-2.3%"
            isPositive={false}
            suffix="/10"
            tooltip="Weighted average climate risk score across portfolio"
          />
        </Box>

        {/* Module Cards Section */}
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
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                Risk Assessment Modules
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                }}
              >
                Specialized tools for comprehensive climate risk analysis
              </Typography>
            </Box>
            <Button
              variant="text"
              endIcon={<ChevronRight size={18} />}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                color: 'primary.main',
              }}
              onClick={() => navigate('/modules')}
            >
              View all modules
            </Button>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {modules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Box key={module.id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      backgroundColor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                      },
                    }}
                    onClick={() => navigate(module.route)}
                  >
                    <CardContent sx={{ p: 3, height: '100%' }}>
                      <Stack spacing={3} sx={{ height: '100%' }}>
                        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              backgroundColor: alpha(CORPORATE_COLORS.secondary, 0.1),
                              color: CORPORATE_COLORS.secondary,
                            }}
                          >
                            <IconComponent size={24} />
                          </Box>
                          {module.tag && (
                            <Chip
                              label={module.tag}
                              size="small"
                              sx={{
                                backgroundColor: alpha(CORPORATE_COLORS.primary, 0.08),
                                color: CORPORATE_COLORS.primary,
                                fontWeight: 500,
                                fontSize: '0.7rem',
                                height: 24,
                              }}
                            />
                          )}
                        </Stack>

                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: 'text.primary',
                              mb: 1.5,
                            }}
                          >
                            {module.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              lineHeight: 1.6,
                            }}
                          >
                            {module.description}
                          </Typography>
                        </Box>

                        <Divider sx={{ borderColor: 'divider' }} />

                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontWeight: 500,
                            }}
                          >
                            Access module
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: alpha(CORPORATE_COLORS.primary, 0.1),
                              color: CORPORATE_COLORS.primary,
                            }}
                          >
                            <ArrowRight size={16} />
                          </Box>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Sector Exposure Section */}
        <Card
          elevation={0}
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                Sector Exposure Analysis
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mt: 0.5,
                }}
              >
                Risk distribution across economic sectors
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
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
                        backgroundColor: alpha(
                          sector.risk === 'High' 
                            ? CORPORATE_COLORS.error 
                            : sector.risk === 'Medium' 
                            ? CORPORATE_COLORS.warning 
                            : CORPORATE_COLORS.success,
                          0.05
                        ),
                        border: '1px solid',
                        borderColor: alpha(
                          sector.risk === 'High' 
                            ? CORPORATE_COLORS.error 
                            : sector.risk === 'Medium' 
                            ? CORPORATE_COLORS.warning 
                            : CORPORATE_COLORS.success,
                          0.2
                        ),
                        borderRadius: 2,
                      }}
                    >
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              color: 'text.primary',
                            }}
                          >
                            {sector.sector}
                          </Typography>
                          <Chip
                            label={sector.risk}
                            size="small"
                            sx={{
                              backgroundColor: alpha(
                                sector.risk === 'High' 
                                  ? CORPORATE_COLORS.error 
                                  : sector.risk === 'Medium' 
                                  ? CORPORATE_COLORS.warning 
                                  : CORPORATE_COLORS.success,
                                0.1
                              ),
                              color: sector.risk === 'High' 
                                ? CORPORATE_COLORS.error 
                                : sector.risk === 'Medium' 
                                ? CORPORATE_COLORS.warning 
                                : CORPORATE_COLORS.success,
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              height: 24,
                            }}
                          />
                        </Stack>
                        
                        <Stack direction="row" alignItems="baseline" spacing={1}>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              color: 'text.primary',
                            }}
                          >
                            ₵{sector.exposure}M
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: CORPORATE_COLORS.success,
                              fontWeight: 600,
                              ml: 1,
                            }}
                          >
                            {sector.trend}
                          </Typography>
                        </Stack>
                        
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                          }}
                        >
                          Exposure value with quarterly trend
                        </Typography>
                      </Stack>
                    </Paper>
                  </Box>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Recent Activity Footer */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: 'block',
              textAlign: 'center',
            }}
          >
            Last updated: Today at 14:30 • Data refresh every 24 hours
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}