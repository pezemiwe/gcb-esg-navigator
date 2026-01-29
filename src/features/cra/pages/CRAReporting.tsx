import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  alpha,
  useTheme,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Divider,
  Chip,
} from "@mui/material";
import { FileText, Download, Mail, CheckCircle2, Send } from "lucide-react";
import CRALayout from "../layout/CRALayout";

export default function CRAReporting() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [reportSections, setReportSections] = useState({
    summary: true,
    dataOverview: true,
    segmentation: true,
    physicalRisk: true,
    transitionRisk: true,
    collateralSensitivity: false,
    recommendations: true,
  });
  const [reportTitle, setReportTitle] = useState(
    "Climate Risk Assessment Report",
  );
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSectionToggle = (section: keyof typeof reportSections) => {
    setReportSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleGeneratePDF = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert("PDF Report Generated Successfully!");
    }, 2000);
  };

  const handleGenerateExcel = () => {
    alert("Excel Report Generated Successfully!");
  };

  const handleScheduleReport = () => {
    if (!recipientEmail) {
      alert("Please enter a recipient email address");
      return;
    }
    alert(`Report scheduled and will be sent to ${recipientEmail}`);
  };

  const selectedSections = Object.values(reportSections).filter(Boolean).length;
  const totalSections = Object.keys(reportSections).length;

  return (
    <CRALayout>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
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
                <FileText size={28} color="#FDB913" strokeWidth={2.5} />
              </Box>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: isDark ? "#FFFFFF" : "#0F172A",
                    fontSize: { xs: "1.75rem", md: "2.25rem" },
                  }}
                >
                  CRA Reporting
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.875rem", md: "1rem" },
                    color: isDark ? alpha("#FFFFFF", 0.65) : "#64748B",
                    mt: 0.5,
                  }}
                >
                  Generate comprehensive climate risk assessment reports and
                  disclosures
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: { xs: "column", lg: "row" },
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
              }}
            >
              <Stack spacing={3}>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.125rem",
                      color: isDark ? "#FFFFFF" : "#0F172A",
                      mb: 2,
                    }}
                  >
                    Report Configuration
                  </Typography>
                  <TextField
                    fullWidth
                    label="Report Title"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      p: 2,
                      backgroundColor: alpha("#FDB913", 0.08),
                      borderRadius: 1.5,
                      border: `1px solid ${alpha("#FDB913", 0.2)}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: isDark ? "#FFFFFF" : "#0F172A",
                      }}
                    >
                      Sections Selected
                    </Typography>
                    <Chip
                      label={`${selectedSections} / ${totalSections}`}
                      size="small"
                      sx={{
                        backgroundColor: "#FDB913",
                        color: "#0F172A",
                        fontWeight: 700,
                      }}
                    />
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      color: isDark ? "#FFFFFF" : "#0F172A",
                      mb: 2,
                    }}
                  >
                    Include Sections
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={reportSections.summary}
                          onChange={() => handleSectionToggle("summary")}
                          sx={{
                            color: "#FDB913",
                            "&.Mui-checked": {
                              color: "#FDB913",
                            },
                          }}
                        />
                      }
                      label={
                        <Stack>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: isDark ? "#FFFFFF" : "#0F172A",
                            }}
                          >
                            Executive Summary
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.8125rem",
                              color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                            }}
                          >
                            High-level overview of key findings
                          </Typography>
                        </Stack>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={reportSections.dataOverview}
                          onChange={() => handleSectionToggle("dataOverview")}
                          sx={{
                            color: "#FDB913",
                            "&.Mui-checked": {
                              color: "#FDB913",
                            },
                          }}
                        />
                      }
                      label={
                        <Stack>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: isDark ? "#FFFFFF" : "#0F172A",
                            }}
                          >
                            Data Overview
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.8125rem",
                              color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                            }}
                          >
                            Asset types and data quality metrics
                          </Typography>
                        </Stack>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={reportSections.segmentation}
                          onChange={() => handleSectionToggle("segmentation")}
                          sx={{
                            color: "#FDB913",
                            "&.Mui-checked": {
                              color: "#FDB913",
                            },
                          }}
                        />
                      }
                      label={
                        <Stack>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: isDark ? "#FFFFFF" : "#0F172A",
                            }}
                          >
                            Portfolio Segmentation
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.8125rem",
                              color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                            }}
                          >
                            Sector, region, and product analysis
                          </Typography>
                        </Stack>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={reportSections.physicalRisk}
                          onChange={() => handleSectionToggle("physicalRisk")}
                          sx={{
                            color: "#FDB913",
                            "&.Mui-checked": {
                              color: "#FDB913",
                            },
                          }}
                        />
                      }
                      label={
                        <Stack>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: isDark ? "#FFFFFF" : "#0F172A",
                            }}
                          >
                            Physical Risk Mapping
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.8125rem",
                              color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                            }}
                          >
                            Climate hazard exposure analysis
                          </Typography>
                        </Stack>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={reportSections.transitionRisk}
                          onChange={() => handleSectionToggle("transitionRisk")}
                          sx={{
                            color: "#FDB913",
                            "&.Mui-checked": {
                              color: "#FDB913",
                            },
                          }}
                        />
                      }
                      label={
                        <Stack>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: isDark ? "#FFFFFF" : "#0F172A",
                            }}
                          >
                            Transition Risk Analytics
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.8125rem",
                              color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                            }}
                          >
                            Low-carbon economy transition risks
                          </Typography>
                        </Stack>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={reportSections.collateralSensitivity}
                          onChange={() =>
                            handleSectionToggle("collateralSensitivity")
                          }
                          sx={{
                            color: "#FDB913",
                            "&.Mui-checked": {
                              color: "#FDB913",
                            },
                          }}
                        />
                      }
                      label={
                        <Stack>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: isDark ? "#FFFFFF" : "#0F172A",
                            }}
                          >
                            Collateral Sensitivity
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.8125rem",
                              color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                            }}
                          >
                            Climate impact on collateral values
                          </Typography>
                        </Stack>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={reportSections.recommendations}
                          onChange={() =>
                            handleSectionToggle("recommendations")
                          }
                          sx={{
                            color: "#FDB913",
                            "&.Mui-checked": {
                              color: "#FDB913",
                            },
                          }}
                        />
                      }
                      label={
                        <Stack>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: isDark ? "#FFFFFF" : "#0F172A",
                            }}
                          >
                            Recommendations
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.8125rem",
                              color: isDark ? alpha("#FFFFFF", 0.6) : "#64748B",
                            }}
                          >
                            Actionable insights and next steps
                          </Typography>
                        </Stack>
                      }
                    />
                  </FormGroup>
                </Box>
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                flex: "0 0 380px",
                backgroundColor: isDark ? "#0F1623" : "#FFFFFF",
                border: `1px solid ${isDark ? alpha("#334155", 0.5) : "#E2E8F0"}`,
                borderRadius: 2,
                p: 3,
                height: "fit-content",
              }}
            >
              <Stack spacing={3}>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.125rem",
                      color: isDark ? "#FFFFFF" : "#0F172A",
                      mb: 2,
                    }}
                  >
                    Generate Report
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      startIcon={isGenerating ? null : <Download size={18} />}
                      disabled={isGenerating || selectedSections === 0}
                      onClick={handleGeneratePDF}
                      sx={{
                        backgroundColor: "#FDB913",
                        color: "#0F172A",
                        fontWeight: 700,
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: "#E5A810",
                        },
                        "&:disabled": {
                          backgroundColor: isDark
                            ? alpha("#334155", 0.3)
                            : "#E2E8F0",
                          color: isDark ? alpha("#FFFFFF", 0.3) : "#94A3B8",
                        },
                      }}
                    >
                      {isGenerating
                        ? "Generating PDF..."
                        : "Generate PDF Report"}
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      startIcon={<Download size={18} />}
                      disabled={selectedSections === 0}
                      onClick={handleGenerateExcel}
                      sx={{
                        borderColor: "#FDB913",
                        color: "#FDB913",
                        fontWeight: 600,
                        py: 1.5,
                        "&:hover": {
                          borderColor: "#FDB913",
                          backgroundColor: alpha("#FDB913", 0.08),
                        },
                        "&:disabled": {
                          borderColor: isDark
                            ? alpha("#334155", 0.3)
                            : "#E2E8F0",
                          color: isDark ? alpha("#FFFFFF", 0.3) : "#94A3B8",
                        },
                      }}
                    >
                      Download as Excel
                    </Button>
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      color: isDark ? "#FFFFFF" : "#0F172A",
                      mb: 2,
                    }}
                  >
                    Schedule Report
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Recipient Email"
                      type="email"
                      placeholder="samuel.agbo@gcbbank.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, display: "flex" }}>
                            <Mail
                              size={18}
                              color={isDark ? "#64748B" : "#94A3B8"}
                            />
                          </Box>
                        ),
                      }}
                    />
                    <Button
                      variant="text"
                      fullWidth
                      startIcon={<Send size={18} />}
                      onClick={handleScheduleReport}
                      sx={{
                        color: "#FDB913",
                        fontWeight: 600,
                        "&:hover": {
                          backgroundColor: alpha("#FDB913", 0.08),
                        },
                      }}
                    >
                      Send Report Now
                    </Button>
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Stack
                    spacing={1.5}
                    sx={{
                      p: 2,
                      backgroundColor: alpha("#10B981", 0.08),
                      borderRadius: 1.5,
                      border: `1px solid ${alpha("#10B981", 0.2)}`,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <CheckCircle2 size={20} color="#10B981" />
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          color: isDark ? "#FFFFFF" : "#0F172A",
                        }}
                      >
                        Report Ready
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        fontSize: "0.8125rem",
                        color: isDark ? alpha("#FFFFFF", 0.7) : "#64748B",
                      }}
                    >
                      All required data has been uploaded and validated. Your
                      CRA report is ready to generate.
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Stack>
      </Box>
    </CRALayout>
  );
}
