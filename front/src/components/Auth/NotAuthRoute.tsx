import { useAuthStore } from "@/store/useAuthStore";
import { Navigate } from "react-router-dom";

const NotAuthRoute = ({ children }: { children: React.ReactElement }) => {
    const isAuth: boolean = useAuthStore((state) => state.isAuth);

    if (isAuth) {
        return <Navigate to="/" replace={true} />;
    }

    return children;
};

export default NotAuthRoute;
