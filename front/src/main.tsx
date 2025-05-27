import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import React from "react";
import { GlobalStyles } from "./style/GlobalStyles.ts";
import MainPage from "./pages/MainPage/MainPage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import PrivateRoute from "./components/Auth/ProtectedRoute.tsx";
import NotAuthRoute from "./components/Auth/NotAuthRoute.tsx";
import MyPage from "./pages/MyPage/MyPage.tsx";
import CartPage from "./pages/CartPage/CartPage.tsx";
import WishlistPage from "./pages/WishlistPage/WishlistPage.tsx";
import OrdersPage from "./pages/OrdersPage/OrdersPage.tsx";

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
                <RegisterPage />
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
            <PrivateRoute>
                <MyPage />
            </PrivateRoute>
        ),
    },
    {
        path: "/cart",
        element: (
            <PrivateRoute>
                <CartPage />
            </PrivateRoute>
        ),
    },
    {
        path: "/wishlist",
        element: (
            <PrivateRoute>
                <WishlistPage />
            </PrivateRoute>
        ),
    },
    {
        path: "/orders",
        element: (
            <PrivateRoute>
                <OrdersPage />
            </PrivateRoute>
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
