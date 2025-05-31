import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import React from "react";
import { GlobalStyles } from "./style/GlobalStyles.ts";
import MainPage from "./pages/MainPage/MainPage.tsx";
import UserRegisterPage from "./pages/RegisterPage/UserRegisterPage.tsx";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import ProtectedRoute from "./components/Auth/ProtectedRoute.tsx";
import SellerProtectedRoute from "./components/Auth/SellerProtectedRoute.tsx";
import NotAuthRoute from "./components/Auth/NotAuthRoute.tsx";
import MyPage from "./pages/MyPage/MyPage.tsx";
import CartPage from "./pages/CartPage/CartPage.tsx";
import WishlistPage from "./pages/WishlistPage/WishlistPage.tsx";
import OrdersPage from "./pages/OrdersPage/OrdersPage.tsx";
import SellerRegisterPage from "./pages/RegisterPage/SellerRegisterPage.tsx";
import AddProduct from "./pages/SellerPage/AddProduct.tsx";
import SellerOrdersPage from "./pages/SellerPage/SellerOrdersPage.tsx";
import SellerMyPage from "./pages/SellerPage/SellerMyPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <MainPage />,
            },
        ],
    },
    {
        path: "/register",
        element: (
            <NotAuthRoute>
                <UserRegisterPage />
            </NotAuthRoute>
        ),
    },
    {
        path: "/sellerRegister",
        element: (
            <NotAuthRoute>
                <SellerRegisterPage />
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
    {
        path: "/seller/mypage",
        element: (
            <SellerProtectedRoute>
                <SellerMyPage />
            </SellerProtectedRoute>
        ),
    },
]);

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <GlobalStyles />
        <RouterProvider router={router} />
        <ToastContainer
            position="bottom-center"
            autoClose={2000}
            hideProgressBar={true}
            theme="colored"
            limit={1}
            closeButton={false}
        />
    </React.StrictMode>
);
