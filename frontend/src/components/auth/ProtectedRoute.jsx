import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("campusTripToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children ?? <Outlet />;
}

export default ProtectedRoute;