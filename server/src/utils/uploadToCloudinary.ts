import streamifier from "streamifier";
import cloudinary from "./cloudinary";

export function uploadBufferToCloudinary(
    buffer: Buffer,
    folder = "greencart",
): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
            if (err || !result?.secure_url || !result?.public_id) return reject(err);
            resolve({ url: result.secure_url, publicId: result.public_id });
        });
        streamifier.createReadStream(buffer).pipe(stream);
    });
}
