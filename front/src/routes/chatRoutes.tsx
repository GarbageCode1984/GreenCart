import { RouteObject } from "react-router-dom";
import ChatPage from "@/pages/ChatPage/ChatPage";

export const chatRoutes: RouteObject[] = [
    {
        path: "/chat",
        element: <ChatPage />,
    },
    {
        path: "/chat/:conversationId",
        element: <ChatPage />,
    },
];
