import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
);
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

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

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
