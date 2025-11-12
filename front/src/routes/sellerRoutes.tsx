import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import AddProduct from "@/pages/SellerPage/AddProduct";
import EditProduct from "@/pages/SellerPage/EditProduct";
import { RouteObject } from "react-router-dom";

export const sellerRoutes: RouteObject[] = [
    {
        path: "/seller/add-product",
        element: (
            <ProtectedRoute>
                <AddProduct />
            </ProtectedRoute>
        ),
    },
    {
        path: "/seller/edit-product/:productId",
        element: (
            <ProtectedRoute>
                <EditProduct />
            </ProtectedRoute>
        ),
    },
];
