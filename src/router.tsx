import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
// import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./layouts/ProtectedRoutes";

// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
import OrdersPage from "./pages/OrdersPage";
import ReportsPage from "./pages/ReportsPage";
import MaintenancePage from "./pages/MaintenancePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute forbiddenRoles={["USER"]} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <OrdersPage /> },
          { path: "orders", element: <OrdersPage /> },
          { path: "reports", element: <ReportsPage /> },
          {
            element: <ProtectedRoute allowedRoles={["Administrador"]} />,
            children: [{ path: "maintenance", element: <MaintenancePage /> }],
          },
        ],
      },
    ],
  },
  // {
  //   path: "/login",
  //   element: <AuthLayout />,
  //   children: [{ index: true, element: <LoginPage /> }],
  // },
  // {
  //   path: "/register",
  //   element: <AuthLayout />,
  //   children: [{ index: true, element: <RegisterPage /> }],
  // },
]);