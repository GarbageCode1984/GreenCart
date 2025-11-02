import mongoose, { Schema } from "mongoose";
export interface Product {
    _id: string;
    name: string;
    price: number;
    categoryId: string;
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
        categoryId: { type: String, required: true },
        description: { type: String, default: "" },
        images: [{ type: String }],
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        sellerName: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model<Product>("Product", ProductSchema);

export default Product;
