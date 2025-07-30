import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import Product, { IProduct } from "../models/Product";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error("이미지 파일(jpeg, jpg, png, gif)만 업로드할 수 있습니다!"));
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

interface CustomRequest extends Request {
    body: {
        name: string;
        price: string;
        categoryId: string;
        description?: string;
    };
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

router.post("/create", upload.array("images", 5), async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { name, price, categoryId, description } = req.body;
        const images = req.files;

        if (!name || !price || !categoryId) {
            return res.status(400).json({ message: "상품명, 가격, 카테고리는 필수 항목입니다." });
        }
        if (isNaN(Number(price)) || Number(price) <= 0) {
            return res.status(400).json({ message: "유효하지 않은 숫자입니다." });
        }

        const imageUrls = images ? (images as Express.Multer.File[]).map((file) => `/uploads/${file.filename}`) : [];

        const newProduct = new Product({
            name,
            price: Number(price),
            categoryId,
            description,
            images: imageUrls,
        });

        const createdProduct = await newProduct.save();

        res.status(201).json({
            message: "상품이 성공적으로 등록되었습니다!",
            product: createdProduct,
            filePaths: imageUrls,
        });
    } catch (error) {
        console.error("상품 등록 처리 중 에러 발생", error);
        next(error);
    }
});

export default router;
