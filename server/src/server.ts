import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";

dotenv.config();
const app = express();
const PORT = 5000;

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
);
app.use(bodyParser.json());

mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => {
        console.log("DB 연결 완료");
    })
    .catch((err) => {
        console.log(err);
    });

app.use("/users", userRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
