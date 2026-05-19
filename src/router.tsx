import { Navigate, createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./layouts/ProtectedRoutes";
import LoginPage from "./pages/LoginPage";
import MaintenancePage from "./pages/MaintenancePage";
import OrdersPage from "./pages/OrdersPage";
import ReportsPage from "./pages/ReportsPage";

const protectedRoutes = [
  { index: true, element: <Navigate replace to="/orders" /> },
  { path: "orders", element: <OrdersPage /> },
  { path: "reports", element: <ReportsPage /> },
  {
    element: <ProtectedRoute allowedRoles={["Administrador"]} />,
    children: [{ path: "maintenance", element: <MaintenancePage /> }],
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: protectedRoutes,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/no-authorized",
    element: <LoginPage />,
  },
  {
    path: "/no-permission",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <Navigate replace to="/" />,
  },
]);
