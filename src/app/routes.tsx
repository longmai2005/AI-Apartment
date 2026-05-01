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
import { ManagerLogin, isManagerAuthenticated } from "./pages/ManagerLogin";
import { ManagerApp } from "./pages/ManagerApp";
import { DevLogin, isDevAuthenticated } from "./pages/DevLogin";
import { DevApp } from "./pages/DevApp";
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
function ManagerGuard() {
  return isManagerAuthenticated() ? <ManagerApp /> : <Navigate to="/manager/login" replace />;
}
function DevGuard() {
  return isDevAuthenticated() ? <DevApp /> : <Navigate to="/dev/login" replace />;
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
  const isPortal = location.pathname.startsWith("/admin") || location.pathname.startsWith("/manager") || location.pathname.startsWith("/dev");
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 0.985, filter: "blur(6px)", y: isPortal ? 0 : 12 }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
        exit={{ opacity: 0, scale: 1.01, filter: "blur(4px)", y: isPortal ? 0 : -8 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
      // Tenant
      { path: "/tenant/register",     Component: TenantRegister },
      { path: "/tenant/login",        Component: TenantLogin },
      { path: "/tenant/*",            Component: TenantApp },
      // Landlord
      { path: "/landlord/register",   Component: LandlordRegister },
      { path: "/landlord/login",      Component: LandlordLogin },
      { path: "/landlord/*",          Component: LandlordApp },
      // Admin (siêu quản trị)
      { path: "/admin/login",         Component: AdminLogin },
      { path: "/admin/*",             Component: AdminGuard },
      // Building Manager
      { path: "/manager/login",       Component: ManagerLogin },
      { path: "/manager/*",           Component: ManagerGuard },
      // Developer
      { path: "/dev/login",           Component: DevLogin },
      { path: "/dev/*",               Component: DevGuard },
      // Sub-pages
      { path: "/security",            Component: SecurityPage },
      { path: "/contracts",           Component: ContractsGuard },
      { path: "/payments",            Component: PaymentsGuard },
      { path: "/reports",             Component: ReportsGuard },
    ],
  },
]);
