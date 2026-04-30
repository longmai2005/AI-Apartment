import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { LandingPage } from "./pages/LandingPage";
import { TenantApp } from "./pages/TenantApp";
import { TenantRegister } from "./pages/TenantRegister";
import { TenantLogin } from "./pages/TenantLogin";
import { LandlordApp } from "./pages/LandlordApp";
import { LandlordRegister } from "./pages/LandlordRegister";
import { LandlordLogin } from "./pages/LandlordLogin";
import { AdminPanel } from "./pages/AdminPanel";
import { AdminLogin, isAdminAuthenticated } from "./pages/AdminLogin";
import { SecurityPage } from "./pages/SecurityPage";
import { ContractsPage } from "./pages/ContractsPage";
import { PaymentsPage } from "./pages/PaymentsPage";
import { ReportsPage } from "./pages/ReportsPage";

function isLandlordAuthenticated() {
  try { return localStorage.getItem("nv-landlord-logged-in") === "true"; } catch { return false; }
}
function isTenantAuthenticated() {
  try { return localStorage.getItem("nv-tenant-logged-in") === "true"; } catch { return false; }
}

function AdminGuard() {
  return isAdminAuthenticated() ? <AdminPanel /> : <Navigate to="/admin/login" replace />;
}
function ContractsGuard() {
  return isLandlordAuthenticated() ? <ContractsPage /> : <Navigate to="/landlord/login" replace />;
}
function ReportsGuard() {
  return isLandlordAuthenticated() ? <ReportsPage /> : <Navigate to="/landlord/login" replace />;
}
function PaymentsGuard() {
  return isTenantAuthenticated() ? <PaymentsPage /> : <Navigate to="/tenant/login" replace />;
}

function PageTransition() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        style={{ minHeight: "100vh" }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

export const router = createBrowserRouter([
  {
    element: <PageTransition />,
    children: [
      { path: "/",                    Component: LandingPage },
      { path: "/tenant/register",     Component: TenantRegister },
      { path: "/tenant/login",        Component: TenantLogin },
      { path: "/tenant/*",            Component: TenantApp },
      { path: "/landlord/register",   Component: LandlordRegister },
      { path: "/landlord/login",      Component: LandlordLogin },
      { path: "/landlord/*",          Component: LandlordApp },
      { path: "/admin/login",         Component: AdminLogin },
      { path: "/admin/*",             Component: AdminGuard },
      { path: "/security",            Component: SecurityPage },
      { path: "/contracts",           Component: ContractsGuard },
      { path: "/payments",            Component: PaymentsGuard },
      { path: "/reports",             Component: ReportsGuard },
    ],
  },
]);
