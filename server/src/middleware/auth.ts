import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "인증 토큰 오류" });
    }

    const token = authHeader.split(" ")[1];

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        console.error("JWT_SECRET 환경 변수가 설정되지 않았습니다.");
        return res.status(500).json({ message: "서버 오류" });
    }

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

export default authMiddleware;
