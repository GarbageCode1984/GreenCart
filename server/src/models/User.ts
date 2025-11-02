import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

export interface User {
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
    createdAt: Date;
    updatedAt: Date;
}

export interface UserDocument extends User, Document {
    _id: mongoose.Types.ObjectId;
    __v?: number;
    comparePassword(plainPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, minlength: 2, maxlength: 16, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [
                /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
                "유효한 이메일 형식이 아닙니다.",
            ],
        },
        password: { type: String, required: true, minlength: 8, maxlength: 100, select: false },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const hashPassword = await bcrypt.hash(this.password, 12);
        this.password = hashPassword;
        next();
    } catch (error: any) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (plainPassword: string): Promise<boolean> {
    let user = this;
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    return isMatch;
};

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
