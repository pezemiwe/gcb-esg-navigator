import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { AuthGuard, RoleGuard } from "@/guards";
import { UserRole } from "@/config/permissions.config";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

const LandingPage = lazy(() => import("@/features/landing/LandingPage"));
const LoginPage = lazy(() => import("@/features/auth/LoginPage"));
const DashboardPage = lazy(() => import("@/features/dashboard/DashboardPage"));
const CRAOverview = lazy(() => import("@/features/cra/pages/CRAOverview"));
const CRADataUpload = lazy(() => import("@/features/cra/CRADataUpload"));
const PortfolioSegmentation = lazy(
  () => import("@/features/cra/pages/PortfolioSegmentation"),
);
const PhysicalRiskAssessment = lazy(
  () => import("@/features/cra/pages/PhysicalRiskAssessment"),
);
const TransitionRiskAssessment = lazy(
  () => import("@/features/cra/pages/TransitionRiskAssessment"),
);
const CollateralSensitivity = lazy(
  () => import("@/features/cra/pages/CollateralSensitivity"),
);
const CRAReporting = lazy(() => import("@/features/cra/pages/CRAReporting"));
const DataViewer = lazy(() => import("@/features/cra/pages/DataViewer"));

function LoadingFallback() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#0F172A",
      }}
    >
      <CircularProgress sx={{ color: "#FDB913" }} />
    </Box>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={Object.values(UserRole)}>
                <ErrorBoundary>
                  <DashboardPage />
                </ErrorBoundary>
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/cra"
          element={
            <AuthGuard>
              <RoleGuard
                allowedRoles={[
                  UserRole.ADMIN,
                  UserRole.ESG_MANAGER,
                  UserRole.RISK_ANALYST,
                  UserRole.PORTFOLIO_MANAGER,
                  UserRole.EXECUTIVE,
                ]}
              >
                <ErrorBoundary>
                  <CRAOverview />
                </ErrorBoundary>
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/cra/data"
          element={
            <AuthGuard>
              <RoleGuard
                allowedRoles={[
                  UserRole.ADMIN,
                  UserRole.ESG_MANAGER,
                  UserRole.DATA_ENTRY,
                ]}
              >
                <ErrorBoundary>
                  <CRADataUpload />
                </ErrorBoundary>
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/cra/data/:assetTypeId"
          element={
            <AuthGuard>
              <RoleGuard
                allowedRoles={[
                  UserRole.ADMIN,
                  UserRole.ESG_MANAGER,
                  UserRole.DATA_ENTRY,
                  UserRole.RISK_ANALYST,
                  UserRole.PORTFOLIO_MANAGER,
                ]}
              >
                <ErrorBoundary>
                  <DataViewer />
                </ErrorBoundary>
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/cra/segmentation"
          element={
            <AuthGuard>
              <RoleGuard
                allowedRoles={[
                  UserRole.ADMIN,
                  UserRole.ESG_MANAGER,
                  UserRole.RISK_ANALYST,
                  UserRole.PORTFOLIO_MANAGER,
                ]}
              >
                <ErrorBoundary>
                  <PortfolioSegmentation />
                </ErrorBoundary>
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/cra/physical-risk"
          element={
            <AuthGuard>
              <RoleGuard
                allowedRoles={[
                  UserRole.ADMIN,
                  UserRole.ESG_MANAGER,
                  UserRole.RISK_ANALYST,
                ]}
              >
                <ErrorBoundary>
                  <PhysicalRiskAssessment />
                </ErrorBoundary>
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/cra/transition-risk"
          element={
            <AuthGuard>
              <RoleGuard
                allowedRoles={[
                  UserRole.ADMIN,
                  UserRole.ESG_MANAGER,
                  UserRole.RISK_ANALYST,
                ]}
              >
                <ErrorBoundary>
                  <TransitionRiskAssessment />
                </ErrorBoundary>
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/cra/collateral"
          element={
            <AuthGuard>
              <RoleGuard
                allowedRoles={[
                  UserRole.ADMIN,
                  UserRole.ESG_MANAGER,
                  UserRole.RISK_ANALYST,
                ]}
              >
                <ErrorBoundary>
                  <CollateralSensitivity />
                </ErrorBoundary>
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/cra/reporting"
          element={
            <AuthGuard>
              <RoleGuard
                allowedRoles={[
                  UserRole.ADMIN,
                  UserRole.ESG_MANAGER,
                  UserRole.RISK_ANALYST,
                  UserRole.EXECUTIVE,
                ]}
              >
                <ErrorBoundary>
                  <CRAReporting />
                </ErrorBoundary>
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <DashboardPage />
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/demo"
          element={
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          }
        />

        <Route path="/privacy" element={<DashboardPage />} />
        <Route path="/terms" element={<DashboardPage />} />
        <Route path="/compliance" element={<DashboardPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
