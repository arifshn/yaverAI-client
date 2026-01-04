import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/store";

export default function AuthGuard() {
  const { user } = useAppSelector((state) => state.account);
  const location = useLocation();

  // Hem eski hem yeni storage key'lerini kontrol et
  const userFromStorage = localStorage.getItem("user"); // Eski email/password login
  const yaverAIUser = localStorage.getItem("yaverAI_user"); // Yeni OAuth login
  const yaverAIToken = localStorage.getItem("yaverAI_token"); // OAuth token

  // Redux store'daki user VEYA localStorage'daki herhangi bir user bilgisi
  const isAuthenticated =
    user || userFromStorage || (yaverAIUser && yaverAIToken);

  if (!isAuthenticated) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
