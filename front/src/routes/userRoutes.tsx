import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import CartPage from "@/pages/CartPage/CartPage";
import OrdersPage from "@/pages/OrdersPage/OrdersPage";
import WishlistPage from "@/pages/WishlistPage/WishlistPage";
import { RouteObject } from "react-router-dom";

export const userRoutes: RouteObject[] = [
    {
        path: "/cart",
        element: (
            <ProtectedRoute>
                <CartPage />
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
