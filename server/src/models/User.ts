import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
            enum: ["user", "admin", "seller"],
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
    } catch (error: any) {
        next(error);
    }
});

const User = mongoose.model("User", userSchema);
export default User;
