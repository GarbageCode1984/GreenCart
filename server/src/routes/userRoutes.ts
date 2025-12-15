import express, { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { Types } from "mongoose";

const router = express.Router();

router.get("/auth", authMiddleware, async (req: Request, res: Response) => {
    res.status(200).json({ message: "인증 성공" });
});

router.post("/register", async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    try {
        const newUser = new User({ name, email, password, role });
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

router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error("Login Route Error: JWT_SECRET is not defined!");
        return res.status(500).json({ message: "서버 설정 오류가 발생했습니다." });
    }

    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
        }

        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "24h" });
        const userResponseData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            wishlist: user.wishlist,
        };
        res.status(200).json({
            message: "로그인 성공",
            token: token,
            user: userResponseData,
        });
    } catch (error: any) {
        console.error("Login error:", error);
        res.status(500).json({ message: "로그인 중 서버 오류가 발생했습니다." });
    }
});

router.post("/wishlist/:productId", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { productId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "로그인이 필요합니다." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "유저를 찾을 수 없습니다." });
        }

        const isWished = (user.wishlist as any).includes(productId);

        if (isWished) {
            (user.wishlist as any).pull(productId);
            await user.save();
            return res.status(200).json({
                message: "관심 상품이 해제되었습니다.",
                isWished: false,
                wishlist: user.wishlist,
            });
        } else {
            (user.wishlist as any).push(productId);
            await user.save();
            return res.status(200).json({
                message: "관심 상품이 등록되었습니다.",
                isWished: true,
                wishlist: user.wishlist,
            });
        }
    } catch (error) {
        console.error("Wishlist toggle error:", error);
        res.status(500).json({ message: "찜하기 처리 중 오류가 발생했습니다." });
    }
});

router.get("/wishlist", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "로그인이 필요합니다." });
        }

        const user = await User.findById(userId).populate("wishlist");

        if (!user) {
            return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
        }

        return res.status(200).json({ message: "찜 목록 조회 성공", wishlist: user.wishlist });
    } catch (error) {
        console.error("Get wishlist error:", error);
        res.status(500).json({ message: "찜 목록을 불러오는데 실패했습니다." });
    }
});

export default router;
