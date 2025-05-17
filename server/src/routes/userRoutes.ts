import express, { Request, Response } from "express";
import User from "../models/User";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: "회원가입 성공" });
    } catch (error: any) {
        console.error("Register error:", error);

        if (error.code === 11000) {
            return res.status(400).json({ message: "이미 사용중인 이메일입니다." });
        }

        return res.status(500).json({ message: "회원가입 중 서버 오류가 발생했습니다.", error: error.message });
    }
});

router.post("/login", async (req: Request, res: Response) => {});

export default router;
