import express, { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { authenticate, AuthRequest } from "../middleware/auth";
import axios from "axios";

const router = express.Router();

router.get("/auth", authenticate, async (req: Request, res: Response) => {
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

router.post("/wishlist/:productId", authenticate, async (req: AuthRequest, res: Response) => {
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

router.get("/wishlist", authenticate, async (req: AuthRequest, res: Response) => {
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

router.patch("/profile", authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { name, currentPassword, newPassword } = req.body;

        const user = await User.findById(userId).select("+password");
        if (!user) return res.status(404).json({ message: "유저를 찾을 수 없습니다." });

        if (name) user.name = name;

        if (currentPassword && newPassword) {
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ message: "현재 비밀번호가 일치하지 않습니다." });
            }
            user.password = newPassword;
        }

        await user.save();

        const updatedUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            wishlist: user.wishlist,
        };

        res.status(200).json({
            message: "회원 정보가 성공적으로 수정되었습니다.",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "정보 수정 중 오류가 발생했습니다." });
    }
});

router.delete("/withdraw", authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: "권한이 없습니다." });

        await User.findByIdAndDelete(userId);
        // await Product.deleteMany({ sellerId: userId });

        res.status(200).json({ message: "회원 탈퇴가 완료되었습니다." });
    } catch (error) {
        console.error("Withdraw error:", error);
        res.status(500).json({ message: "회원 탈퇴 처리 중 오류가 발생했습니다." });
    }
});

router.post("/auth/kakao", async (req: Request, res: Response) => {
    try {
        const { code } = req.body;
        const KAKAO_CLIENT_ID = process.env.KAKAO_REST_API_KEY;
        const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

        // 1. 카카오 서버로 인가 코드를 보내 액세스 토큰 발급 받기
        const tokenResponse = await axios.post(
            "https://kauth.kakao.com/oauth/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                client_id: KAKAO_CLIENT_ID || "",
                redirect_uri: KAKAO_REDIRECT_URI || "",
                code,
            }).toString(),
            {
                headers: {
                    "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
                },
            },
        );

        const kakaoAccessToken = tokenResponse.data.access_token;

        // 2. 발급받은 액세스 토큰으로 카카오 유저 정보 가져오기
        const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
            headers: {
                Authorization: `Bearer ${kakaoAccessToken}`,
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
        });

        const kakaoUser = userResponse.data;
        const kakaoAccount = kakaoUser.kakao_account;

        // 이메일이 없을 경우 카카오 고유 ID를 활용해 가상 이메일 생성
        const email = kakaoAccount?.email || `${kakaoUser.id}@kakao.com`;
        const name = kakaoAccount?.profile?.nickname || `카카오유저${kakaoUser.id.toString().slice(0, 4)}`;

        // 3. DB에 해당 이메일로 가입된 유저가 있는지 확인
        let user = await User.findOne({ email });

        if (!user) {
            // 없으면 새 유저로 가입 처리 (비밀번호는 소셜 로그인 전용 무작위 값 지정)
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            user = new User({
                name,
                email,
                password: randomPassword,
                role: "user",
            });
            await user.save();
        }

        // 4. 일반 로그인과 동일하게 JWT 토큰 생성 및 발급
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) return res.status(500).json({ message: "JWT 설정 오류" });

        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "24h" });

        const userResponseData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            wishlist: user.wishlist,
        };

        res.status(200).json({
            message: "카카오 로그인 성공",
            token: token,
            user: userResponseData,
        });
    } catch (error: any) {
        console.error("Kakao Login Error:", error.response?.data || error.message);
        res.status(500).json({ message: "카카오 로그인 처리 중 오류가 발생했습니다." });
    }
});

export default router;
