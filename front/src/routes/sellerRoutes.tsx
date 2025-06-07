import NotAuthRoute from "@/components/Auth/NotAuthRoute";
import SellerProtectedRoute from "@/components/Auth/SellerProtectedRoute";
import SellerRegisterPage from "@/pages/RegisterPage/SellerRegisterPage";
import AddProduct from "@/pages/SellerPage/AddProduct";
import SellerOrdersPage from "@/pages/SellerPage/SellerOrdersPage";
import { RouteObject } from "react-router-dom";

export const sellerRoutes: RouteObject[] = [
    {
        path: "/sellerRegister",
        element: (
            <NotAuthRoute>
                <SellerRegisterPage />
            </NotAuthRoute>
        ),
    },
    {
        path: "/seller/add-product",
        element: (
            <SellerProtectedRoute>
                <AddProduct />
            </SellerProtectedRoute>
        ),
    },
    {
        path: "/seller/orders",
        element: (
            <SellerProtectedRoute>
                <SellerOrdersPage />
            </SellerProtectedRoute>
        ),
    },
];
