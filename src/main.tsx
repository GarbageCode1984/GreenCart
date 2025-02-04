import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import React from "react";
import { GlobalStyles } from "./style/GlobalStyles.ts";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
]);
createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <GlobalStyles />
        <RouterProvider router={router} />
    </React.StrictMode>
);
