import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product";
import { authMiddleware, AuthRequest, protect } from "../middleware/auth";
import fs from "fs";
import { error } from "console";

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
        region: string;
        hashtag?: string;
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

            const { name, price, region, hashtag, description } = req.body;
            const images = req.files;

            if (!name || !price || !region) {
                return res.status(400).json({ message: "상품명, 가격, 지역은 필수 항목입니다." });
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
                region,
                hashtag,
                description,
                images: imageUrls,
                sellerId: sellerId,
                sellerName: sellerName,
                status: "FOR_SALE",
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
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        const totalCount = await Product.countDocuments({});
        const totalPages = Math.ceil(totalCount / limit);

        const products = await Product.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

        res.status(200).json({
            message: "상품 목록을 불러왔습니다.",
            products: products,
            currentPage: page,
            totalPages: totalPages,
            totalCount: totalCount,
        });
    } catch (error) {
        console.error("상품 목록 조회 중 에러 발생:", error);
        next(error);
    }
});

router.get("/search", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { q } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        if (!q || typeof q !== "string") {
            return res.status(400).json({ message: "검색어를 입력해주세요." });
        }

        const query = { $or: [{ name: { $regex: q, $options: "i" } }, { hashtag: { $regex: q, $options: "i" } }] };

        const totalCount = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        const products = await Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

        res.status(200).json({
            products,
            currentPage: page,
            totalPages,
            totalCount,
        });
    } catch (error) {
        console.error("상품 검색 중 에러 발생:", error);
        next(error);
    }
});

router.get("/getProductDetail/:id", async (req: Request, res: Response, next: NextFunction) => {
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

router.patch(
    "/update/:id",
    authMiddleware,
    upload.fields([{ name: "newImages", maxCount: 5 }]),
    async (req: AuthRequest, res: Response) => {
        const productId = req.params.id;
        const userId = req.user?.id;

        const { name, price, region, hashtag, description, existingImages } = req.body;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const images = files?.newImages;

        if (!userId) {
            return res.status(401).json({ message: "인증 정보가 유효하지 않습니다." });
        }

        try {
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
            }

            if (product.sellerId.toString() !== userId.toString()) {
                return res.status(403).json({ message: "상품 수정 권한이 없습니다." });
            }

            const newImagesUrls = images ? images.map((file) => `/uploads/${file.filename}`) : [];

            let existingImageUrls: string[] = [];
            if (existingImages) {
                try {
                    existingImageUrls = JSON.parse(existingImages);
                    if (!Array.isArray(existingImageUrls)) {
                        existingImageUrls = [];
                    }
                } catch (error) {
                    console.error(error);
                    return res.status(400).json({ message: "잘못된 이미지 목록 형식입니다." });
                }
            }

            const totalData: any = {};
            if (name) totalData.name = name;
            if (price) totalData.price = Number(price);
            if (region) totalData.region = region;
            if (hashtag) totalData.hashtag = hashtag;
            if (description) totalData.description = description;

            totalData.images = [...existingImageUrls, ...newImagesUrls];

            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                { $set: totalData },
                { new: true, runValidators: true }
            );

            res.status(200).json({
                message: "상품 수정 성공",
                product: updatedProduct,
            });
        } catch (error: any) {
            console.error("Product update error:", error);
            res.status(500).json({ message: "상품 수정 중 서버 오류가 발생했습니다.", error: error.message });
        }
    }
);

router.delete("/delete/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    const productId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "인증 정보가 유효하지 않습니다." });
    }

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(204).send();
        }

        if (product.sellerId.toString() !== userId) {
            return res.status(403).json({ message: "상품 삭제 권한이 없습니다. (판매자만 삭제 가능)" });
        }

        if (product.images && product.images.length > 0) {
            product.images.forEach((imagePath) => {
                try {
                    const relativePath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
                    const fullPath = path.join(process.cwd(), relativePath);

                    fs.unlink(fullPath, (err) => {
                        if (err) {
                            console.error("File delete error:", err);
                        }
                    });
                } catch (error) {
                    console.error("이미지 경로 처리 중 오류:", error);
                }
            });
        }

        await Product.findByIdAndDelete(productId);

        res.status(204).send();
    } catch (error: any) {
        console.error("Product delete error:", error);
        res.status(500).json({ message: "상품 삭제 중 서버 오류가 발생했습니다.", error: error.message });
    }
});

router.get("/myProducts", authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "인증 정보가 유효하지 않습니다." });

        const myProducts = await Product.find({ sellerId: userId }).sort({ createdAt: -1 });

        res.status(200).json({ products: myProducts });
    } catch (error) {
        console.error("내 상품 조회 실패:", error);
        next(error);
    }
});

router.patch("/status/:id", authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user?.id;

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "상품 없음" });

        if (product.sellerId.toString() !== userId?.toString()) {
            return res.status(403).json({ message: "수정 권한이 없습니다." });
        }

        product.status = status;
        await product.save();

        res.status(200).json({ message: "상태 변경 성공", product });
    } catch (error) {
        console.error("상태 변경 실패:", error);
        next(error);
    }
});

export default router;
