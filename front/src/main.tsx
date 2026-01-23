import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import React from "react";
import { GlobalStyles } from "./style/GlobalStyles.ts";
import MainPage from "./pages/MainPage/MainPage.tsx";
import { ToastContainer } from "react-toastify";
import { userRoutes } from "./routes/userRoutes.tsx";
import { sellerRoutes } from "./routes/sellerRoutes.tsx";
import { productRoutes } from "./routes/productRoutes.tsx";
import SearchPage from "./pages/SearchPage/SearchPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <MainPage />,
            },
            {
                path: "/search",
                element: <SearchPage />,
            },
        ],
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
            autoClose={1000}
            hideProgressBar={true}
            theme="colored"
            limit={1}
            closeButton={false}
        />
    </React.StrictMode>,
);
