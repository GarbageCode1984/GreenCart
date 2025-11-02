import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product";
import { AuthRequest, protect } from "../middleware/auth";

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

interface CustomRequest extends AuthRequest {
    body: {
        name: string;
        price: string;
        categoryId: string;
        description?: string;
    };
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

router.post(
    "/create",
    protect,
    upload.array("images", 5),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const sellerId = req.user?._id;
            const sellerName = req.user?.name;

            if (!sellerId || !sellerName) {
                return res.status(401).json({ message: "사용자 인증 정보가 누락되었습니다. 다시 로그인해주세요." });
            }

            const { name, price, categoryId, description } = req.body;
            const images = req.files;

            if (!name || !price || !categoryId) {
                return res.status(400).json({ message: "상품명, 가격, 카테고리는 필수 항목입니다." });
            }
            if (isNaN(Number(price)) || Number(price) <= 0) {
                return res.status(400).json({ message: "유효하지 않은 숫자입니다." });
            }

            const imageUrls = images
                ? (images as Express.Multer.File[]).map((file) => `/uploads/${file.filename}`)
                : [];

            const newProduct = new Product({
                name,
                price: Number(price),
                categoryId,
                description,
                images: imageUrls,
                sellerId: sellerId,
                sellerName: sellerName,
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
    }
);

router.get("/findAllProduct", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find({}).lean();
        res.status(200).json({
            message: "상품 목록을 불러왔습니다.",
            products: products,
            count: products.length,
        });
    } catch (error) {
        console.error("상품 목록 조회 중 에러 발생:", error);
        next(error);
    }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
        }

        res.status(200).json({
            message: "상품 상세 정보를 불러왔습니다.",
            product: product,
        });
    } catch (error) {
        console.error(`상품 ID ${req.params.id} 상세 조회 중 에러 발생:`, error);
        next(error);
    }
});

export default router;
