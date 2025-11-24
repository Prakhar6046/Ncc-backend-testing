import { Navigate, Outlet } from "react-router-dom";
import { decryptData } from "../utilities/utils";

const useAuth = () => {
  const _token = decryptData("nccToken");

  if (_token) {
    return {
      auth: true,
    };
  } else {
    return {
      auth: false,
    };
  }
};

const ProtectedRoutes = () => {
  const { auth } = useAuth();

  return auth ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoutes;
