import mongoose, { Schema } from "mongoose";
export interface Product {
    _id: string;
    name: string;
    price: number;
    region: string;
    hashtag?: string;
    description?: string;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
    sellerId: mongoose.Types.ObjectId;
    sellerName: string;
}

const ProductSchema = new mongoose.Schema<Product>(
    {
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        region: { type: String, required: true, trim: true },
        hashtag: { type: String },
        description: { type: String, default: "" },
        images: { type: [String], default: [] },
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        sellerName: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model<Product>("Product", ProductSchema);

export default Product;
