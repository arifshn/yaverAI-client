import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/store";

export default function AuthGuard() {
  const { user } = useAppSelector((state) => state.account);
  const location = useLocation();

  const userFromStorage = localStorage.getItem("user");
  const isAuthenticated = user || userFromStorage;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
