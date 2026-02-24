import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import chatRoutes from "./routes/chatRoutes";
import http from "http";
import { Server } from "socket.io";
import path from "path";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
    }),
);
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => {
        console.log("DB 연결 완료");
    })
    .catch((err) => {
        console.log(err);
    });

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/chat", chatRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const onlineUsers = new Map<string, string>();

io.on("connection", (socket) => {
    // console.log(`User Connected: ${socket.id}`);

    socket.on("addUser", (userId: string) => {
        onlineUsers.set(userId, socket.id);
        // console.log(`👤 User registered: ${userId} with socket ${socket.id}`);
    });

    socket.on("join_room", (roomId) => {
        socket.join(roomId);
        // console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.conversationId).emit("receive_message", data);

        const receiverSocketId = onlineUsers.get(data.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("new_notification", {
                senderName: data.senderName,
                text: data.text,
                conversationId: data.conversationId,
                createdAt: data.createdAt,
            });
            // console.log(`Notification sent to user: ${data.receiverId}`);
        }
    });

    socket.on("disconnect", () => {
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                // console.log(`❌ User disconnected: ${userId}`);
                break;
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
