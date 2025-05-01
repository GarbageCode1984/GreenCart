import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import React from "react";
import { GlobalStyles } from "./style/GlobalStyles.ts";
import MainPage from "./pages/MainPage/MainPage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";

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
        element: <RegisterPage />,
    },
]);

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <GlobalStyles />
        <RouterProvider router={router} />
    </React.StrictMode>
);
