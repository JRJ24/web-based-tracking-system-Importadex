import { Navigate, Outlet } from "react-router-dom";
import { useUsersAuthStore } from "@/context/Auth";

interface Props {
  allowedRoles?: string[];
  forbiddenRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles, forbiddenRoles }: Props) => {
  const user = useUsersAuthStore();

  const isAuthenticated = !!user.token; 
  const userRole = user.user?.role;

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  } 

  if (forbiddenRoles && forbiddenRoles.includes(userRole || "")) {
    return <Navigate to="/NO-PERMISSION" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole || "")) {
    return <Navigate to="/NO-AUTHORIZED" replace />; 
  }
  return <Outlet />;
};

export default ProtectedRoute;