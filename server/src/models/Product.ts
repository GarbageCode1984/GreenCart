import mongoose from "mongoose";
export interface IProduct {
    name: string;
    price: number;
    categoryId: string;
    description?: string;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>(
    {
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        categoryId: { type: String, required: true },
        description: { type: String, default: "" },
        images: [{ type: String }],
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
