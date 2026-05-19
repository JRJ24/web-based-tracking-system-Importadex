import { Navigate, Outlet } from "react-router-dom";
import { useTracking } from "../context/TrackingContext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  forbiddenRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles, forbiddenRoles }: ProtectedRouteProps) {
  const { authUser } = useTracking();
  const role = authUser?.role || "";

  if (!authUser) {
    return <Navigate replace to="/login" />;
  }

  if (forbiddenRoles?.includes(role)) {
    return <Navigate replace to="/no-permission" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate replace to="/no-authorized" />;
  }

  return <Outlet />;
}
