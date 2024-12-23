import useLogin from "./hooks/useLogin";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  const isLoggedIn = useLogin();
  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
}
