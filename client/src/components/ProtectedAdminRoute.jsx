import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedAdminRoute = ({ children }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/" replace />;
    }

    if (user?.role !== "admin") {
        // Redirect to home if not an admin
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;
