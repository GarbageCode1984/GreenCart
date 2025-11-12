import NotAuthRoute from "@/components/Auth/NotAuthRoute";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import LoginPage from "@/pages/LoginPage/LoginPage";
import MyPage from "@/pages/MyPage/MyPage";
import OrdersPage from "@/pages/OrdersPage/OrdersPage";
import UserRegisterPage from "@/pages/RegisterPage/UserRegisterPage";
import WishlistPage from "@/pages/WishlistPage/WishlistPage";
import { RouteObject } from "react-router-dom";

export const userRoutes: RouteObject[] = [
    {
        path: "/register",
        element: (
            <NotAuthRoute>
                <UserRegisterPage />
            </NotAuthRoute>
        ),
    },
    {
        path: "/login",
        element: (
            <NotAuthRoute>
                <LoginPage />
            </NotAuthRoute>
        ),
    },
    {
        path: "/mypage",
        element: (
            <ProtectedRoute>
                <MyPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/wishlist",
        element: (
            <ProtectedRoute>
                <WishlistPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/orders",
        element: (
            <ProtectedRoute>
                <OrdersPage />
            </ProtectedRoute>
        ),
    },
];
