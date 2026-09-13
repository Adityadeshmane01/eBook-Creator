import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">Checking your session...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || "/dashboard"} replace />;
  }

  return children;
};

export default PublicOnlyRoute;