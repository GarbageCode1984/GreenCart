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

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const data = extractAuthData(req, res);
    if (!data) return;
    const { token, jwtSecret } = data;

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            let errorMessage = "유효하지 않은 토큰입니다.";
            if (err.name === "TokenExpiredError") {
                errorMessage = "인증 토큰이 만료되었습니다.";
            } else if (err.name === "JsonWebTokenError") {
                errorMessage = "잘못된 형식의 토큰입니다.";
            }
            return res.status(401).json({ message: errorMessage });
        } else {
            (req as any).user = decoded;
            next();
        }
    });
};

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
        let errorMessage = "유효하지 않은 토큰입니다.";
        if (err.name === "TokenExpiredError") {
            errorMessage = "인증 토큰이 만료되었습니다.";
        } else if (err.name === "JsonWebTokenError") {
            errorMessage = "잘못된 형식의 토큰입니다.";
        }
        return res.status(401).json({ message: errorMessage });
    }
};
