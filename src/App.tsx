import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import TenantManagement from "./components/tenant/TenantManagement";
import CompanyManagement from "./components/company/CompanyManagement";
import CouponManagement from "./components/coupon/CouponManagement";

// Lazy load components for better performance
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));

// Protected route component
const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: JSX.Element;
  requiredRole?: string[];
}) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (
    requiredRole &&
    currentUser.role &&
    !requiredRole.includes(currentUser.role)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      }
    >
      <>
        <Routes>
          <Route
            path="/"
            element={currentUser ? <Navigate to="/dashboard" /> : <Home />}
          />

          {/* Dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />

          {/* Superadmin routes */}
          <Route
            path="/dashboard/tenants"
            element={
              <ProtectedRoute requiredRole={["superadmin"]}>
                <DashboardLayout>
                  <TenantManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/companies"
            element={
              <ProtectedRoute requiredRole={["superadmin"]}>
                <DashboardLayout>
                  <CompanyManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/coupons"
            element={
              <ProtectedRoute requiredRole={["superadmin", "owner"]}>
                <DashboardLayout>
                  <CouponManagement userRole={"superadmin"} />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
