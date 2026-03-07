import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product";
import { authenticate, AuthRequest } from "../middleware/auth";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary";
import cloudinary from "../utils/cloudinary";

const router = express.Router();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) return cb(null, true);
    cb(new Error("이미지 파일(jpeg, jpg, png, gif)만 업로드할 수 있습니다!"));
};

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

function safeParseStringArray(input: any): string[] {
    if (!input) return [];
    if (Array.isArray(input)) return input.map(String);

    if (typeof input === "string") {
        try {
            const parsed = JSON.parse(input);
            if (Array.isArray(parsed)) return parsed.map(String);
            return [];
        } catch {
            return [];
        }
    }
    return [];
}

async function deleteCloudinaryImages(publicIds: string[]) {
    if (!publicIds || publicIds.length === 0) return;

    try {
        await cloudinary.api.delete_resources(publicIds, { resource_type: "image" });
    } catch (e) {
        console.error("Cloudinary delete failed:", e);
    }
}

interface CustomRequest extends AuthRequest {
    body: {
        name: string;
        price: string;
        region: string;
        hashtag?: string;
        description?: string;
        existingImages?: string;
        existingImagePublicIds?: string;
    };
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

router.post(
    "/create",
    authenticate,
    upload.array("images", 5),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const sellerId = req.user?._id;
            const sellerName = req.user?.name;

            if (!sellerId || !sellerName) {
                return res.status(401).json({ message: "사용자 인증 정보가 누락되었습니다. 다시 로그인해주세요." });
            }

            const { name, price, region, hashtag, description } = req.body;
            const files = req.files as Express.Multer.File[] | undefined;

            if (!name || !price || !region) {
                return res.status(400).json({ message: "상품명, 가격, 지역은 필수 항목입니다." });
            }
            if (isNaN(Number(price)) || Number(price) <= 0) {
                return res.status(400).json({ message: "유효하지 않은 숫자입니다." });
            }

            const uploaded = files?.length
                ? await Promise.all(files.map((f) => uploadBufferToCloudinary(f.buffer)))
                : [];

            const imageUrls = uploaded.map((u) => u.url);
            const imagePublicIds = uploaded.map((u) => u.publicId);

            const newProduct = new Product({
                name,
                price: Number(price),
                region,
                hashtag,
                description,
                images: imageUrls,
                imagePublicIds,
                sellerId,
                sellerName,
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
    },
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
            products,
            currentPage: page,
            totalPages,
            totalCount,
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

        const query = {
            $or: [
                { name: { $regex: q, $options: "i" } },
                { hashtag: { $regex: q, $options: "i" } },
                { region: { $regex: q, $options: "i" } },
            ],
        };

        const totalCount = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        const products = await Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

        res.status(200).json({ products, currentPage: page, totalPages, totalCount });
    } catch (error) {
        console.error("상품 검색 중 에러 발생:", error);
        next(error);
    }
});

router.get("/getProductDetail/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) return res.status(404).json({ message: "상품을 찾을 수 없습니다." });

        res.status(200).json({ message: "상품 상세 정보를 불러왔습니다.", product });
    } catch (error) {
        console.error(`상품 ID ${req.params.id} 상세 조회 중 에러 발생:`, error);
        next(error);
    }
});

router.patch(
    "/update/:id",
    authenticate,
    upload.fields([{ name: "newImages", maxCount: 5 }]),
    async (req: CustomRequest, res: Response) => {
        const productId = req.params.id;
        const userId = req.user?.id;

        const { name, price, region, hashtag, description, existingImages, existingImagePublicIds } = req.body;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const newImages = files?.newImages;

        if (!userId) return res.status(401).json({ message: "인증 정보가 유효하지 않습니다." });

        try {
            const product = await Product.findById(productId);
            if (!product) return res.status(404).json({ message: "상품을 찾을 수 없습니다." });

            if (product.sellerId.toString() !== userId.toString()) {
                return res.status(403).json({ message: "상품 수정 권한이 없습니다." });
            }

            const keepImageUrls = safeParseStringArray(existingImages);
            const keepPublicIds = safeParseStringArray(existingImagePublicIds);

            const uploaded = newImages?.length
                ? await Promise.all(newImages.map((f) => uploadBufferToCloudinary(f.buffer)))
                : [];

            const newImageUrls = uploaded.map((u) => u.url);
            const newPublicIds = uploaded.map((u) => u.publicId);

            const prevPublicIds: string[] = Array.isArray((product as any).imagePublicIds)
                ? (product as any).imagePublicIds
                : [];

            if (keepPublicIds.length > 0) {
                const removed = prevPublicIds.filter((id) => !keepPublicIds.includes(id));
                await deleteCloudinaryImages(removed);
            }

            const totalData: any = {};
            if (name) totalData.name = name;
            if (price) totalData.price = Number(price);
            if (region) totalData.region = region;
            if (hashtag) totalData.hashtag = hashtag;
            if (description) totalData.description = description;

            totalData.images = [...keepImageUrls, ...newImageUrls];
            totalData.imagePublicIds = [...keepPublicIds, ...newPublicIds];

            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                { $set: totalData },
                { new: true, runValidators: true },
            );

            res.status(200).json({ message: "상품 수정 성공", product: updatedProduct });
        } catch (error: any) {
            console.error("Product update error:", error);
            res.status(500).json({ message: "상품 수정 중 서버 오류가 발생했습니다.", error: error.message });
        }
    },
);

router.delete("/delete/:id", authenticate, async (req: AuthRequest, res: Response) => {
    const productId = req.params.id;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "인증 정보가 유효하지 않습니다." });

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(204).send();

        if (product.sellerId.toString() !== userId) {
            return res.status(403).json({ message: "상품 삭제 권한이 없습니다. (판매자만 삭제 가능)" });
        }

        const publicIds: string[] = Array.isArray((product as any).imagePublicIds)
            ? (product as any).imagePublicIds
            : [];

        await deleteCloudinaryImages(publicIds);

        await Product.findByIdAndDelete(productId);

        const conversations = await Conversation.find({ productId });
        const conversationIds = conversations.map((c) => c._id);

        await Message.deleteMany({ conversationId: { $in: conversationIds } });
        await Conversation.deleteMany({ productId });

        res.status(204).send();
    } catch (error: any) {
        console.error("Product delete error:", error);
        res.status(500).json({ message: "상품 삭제 중 서버 오류가 발생했습니다.", error: error.message });
    }
});

router.get("/myProducts", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
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

router.patch("/status/:id", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
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
