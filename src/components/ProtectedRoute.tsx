import { Navigate, Outlet } from "react-router-dom";
import userStore from "@/store/UserStore";

interface ProtectedRouteProps {
  allowedRoles: string[];
  redirectTo?: string;
}

const ProtectedRoute = ({ allowedRoles, redirectTo = "/login" }: ProtectedRouteProps) => {
  const user = userStore((state) => state.user);

  if (!user) return <Navigate to={redirectTo} />;

  return allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/not-found" />;
};

export default ProtectedRoute;
