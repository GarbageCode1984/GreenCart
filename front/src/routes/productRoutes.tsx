import { RouteObject } from "react-router-dom";
import ProductListPage from "@/pages/ProductListPage/ProductListPage";
import ProductDetailPage from "@/pages/ProductDetailPage/ProductDetailPage";

export const productRoutes: RouteObject[] = [
    {
        path: "/products",
        element: <ProductListPage />,
    },
    {
        path: "/products/:productId",
        element: <ProductDetailPage />,
    },
];
