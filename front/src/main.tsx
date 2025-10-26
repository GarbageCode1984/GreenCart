import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import React from "react";
import { GlobalStyles } from "./style/GlobalStyles.ts";
import MainPage from "./pages/MainPage/MainPage.tsx";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import NotAuthRoute from "./components/Auth/NotAuthRoute.tsx";
import { userRoutes } from "./routes/userRoutes.tsx";
import { sellerRoutes } from "./routes/sellerRoutes.tsx";
import MyPage from "./pages/MyPage/MyPage.tsx";
import { productRoutes } from "./routes/productRoutes.tsx";

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
        path: "/mypage",
        element: <MyPage />,
    },

    {
        path: "/login",
        element: (
            <NotAuthRoute>
                <LoginPage />
            </NotAuthRoute>
        ),
    },
    ...userRoutes,
    ...sellerRoutes,
    ...productRoutes,
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
