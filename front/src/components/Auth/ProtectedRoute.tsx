import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    const isAuth: boolean = useAuthStore((state) => state.isAuth);
    const location = useLocation();

    if (!isAuth) {
        return <Navigate to="/login" replace={true} state={{ from: location }} />;
    }
    return children;
};

export default ProtectedRoute;
