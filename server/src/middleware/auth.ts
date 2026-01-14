import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "../models/User";

export interface AuthRequest extends Request {
    user?: UserDocument;
}

const extractAuthData = (req: Request, res: Response): { token: string; jwtSecret: string } | null => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ message: "인증 토큰 오류" });
        return null;
    }

    const token = authHeader.split(" ")[1];

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        console.error("JWT_SECRET 환경 변수가 설정되지 않았습니다.");
        res.status(500).json({ message: "서버 설정 오류: JWT 키가 누락되었습니다." });
        return null;
    }

    return { token, jwtSecret };
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const data = extractAuthData(req, res);
    if (!data) return;
    const { token, jwtSecret } = data;

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return handleJwtError(res, err);
        } else {
            (req as any).user = decoded;
            next();
        }
    });
};

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const data = extractAuthData(req, res);
    if (!data) return;
    const { token, jwtSecret } = data;

    try {
        const decoded = jwt.verify(token, jwtSecret) as { id: string };
        const user = await User.findById(decoded.id).select("+password");

        if (!user) {
            return res.status(401).json({ message: "해당 사용자를 찾을 수 없습니다." });
        }

        req.user = user;
        next();
    } catch (err: any) {
        return handleJwtError(res, err);
    }
};

const handleJwtError = (res: Response, err: any) => {
    let message = "유효하지 않은 토큰입니다.";
    if (err.name === "TokenExpiredError") {
        message = "토큰 유효기간이 만료되었습니다. 다시 로그인해주세요.";
    } else if (err.name === "JsonWebTokenError") {
        message = "잘못된 형식의 토큰입니다.";
    }
    return res.status(401).json({ message });
};
