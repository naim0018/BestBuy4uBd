import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "@/store/store";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const token = user?.accessToken;

  // Simple check for now. Ideally, we should verify token validity/expiration.
  // The BaseApi handles 401/refresh token logic for API calls.
  // This component mainly handles route access.

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Or unauthorized page
  }

  return <>{children}</>;
};

export default ProtectedRoute;
