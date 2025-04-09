import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  console.log("User data in protected route", user);
  console.log("isAuthenticated in protected route", isAuthenticated);

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== requiredRole) {
    // Redirect to unauthorized page if no user or role doesn't match
    return <Navigate to="/unauthorized" replace />;
  }

  return children; // Render the child component if all checks pass
};

