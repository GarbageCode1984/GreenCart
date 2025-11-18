import { useState, useCallback, useEffect } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

interface UseImageUploadOptions {
    maxImages: number;
}

interface UseImageUploadReturn {
    imageFiles: File[];
    previewImageUrls: string[];
    imageUploadError: string | null;
    isImageLimit: boolean;
    getRootProps: ReturnType<typeof useDropzone>["getRootProps"];
    getInputProps: ReturnType<typeof useDropzone>["getInputProps"];
    isDragActive: boolean;
    openImagePicker: () => void;

    handleRemoveImage: (indexToRemove: number) => void;
}

export const useImageUpload = ({ maxImages }: UseImageUploadOptions): UseImageUploadReturn => {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imageUploadError, setImageUploadError] = useState<string | null>(null);

    const previewImageUrls = imageFiles.map((file) => URL.createObjectURL(file));

    useEffect(() => {
        const urlsToRevoke = previewImageUrls;
        return () => {
            urlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imageFiles, previewImageUrls]);

    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            setImageUploadError(null);

            if (imageFiles.length + acceptedFiles.length > maxImages) {
                setImageUploadError(`이미지는 최대 ${maxImages}개까지만 업로드할 수 있습니다.`);
                return;
            }

            if (fileRejections.length > 0) {
                const rejectedFileNames = fileRejections.map((rejection) => rejection.file.name).join(", ");
                setImageUploadError(`허용되지 않는 파일이 있습니다: ${rejectedFileNames}`);
                return;
            }

            const newValidFiles = acceptedFiles.filter(
                (file) =>
                    !imageFiles.some(
                        (existingFile) => existingFile.name === file.name && existingFile.size === file.size
                    )
            );

            if (newValidFiles.length === 0 && acceptedFiles.length > 0) {
                setImageUploadError("새롭게 추가할 이미지가 없거나 유효하지 않은 파일입니다.");
                return;
            }

            setImageFiles((prevFiles) => {
                const combinedFiles = [...prevFiles, ...newValidFiles];
                return combinedFiles.slice(0, maxImages);
            });
        },
        [imageFiles, maxImages]
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
        },
        noClick: true,
        noKeyboard: true,
        noDrag: true,
        maxFiles: maxImages - imageFiles.length,
    });

    const handleRemoveImage = useCallback((indexToRemove: number) => {
        setImageFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
        setImageUploadError(null);
    }, []);

    const isImageLimit = imageFiles.length >= maxImages;

    return {
        imageFiles,
        previewImageUrls,
        imageUploadError,
        isImageLimit,
        getRootProps,
        getInputProps,
        isDragActive,
        openImagePicker: open,
        handleRemoveImage,
    };
};
