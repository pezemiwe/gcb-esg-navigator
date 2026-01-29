import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { AuthGuard, RoleGuard } from "@/guards";
import { UserRole } from "@/config/permissions.config";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

const LandingPage = lazy(() => import("@/features/landing/LandingPage"));
const LoginPage = lazy(() => import("@/features/auth/LoginPage"));
const DashboardPage = lazy(() => import("@/features/dashboard/DashboardPage"));

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
              <DashboardPage />
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
                <DashboardPage />
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
                <DashboardPage />
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
                <DashboardPage />
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
                <DashboardPage />
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
                <DashboardPage />
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
                <DashboardPage />
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
