import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

router.post("/create", async (req: Request, res: Response) => {});

export default router;
