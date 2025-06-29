interface UseImageUploadOptions {
    maxImages: number;
}

interface UseImageUploadReturn {
    imageFiles: File[];
    previewImageUrls: string[];
    imageUploadError: string | null;
}

export const useImageUpload = ({ maxImages }: UseImageUploadOptions): UseImageUploadReturn => {};
