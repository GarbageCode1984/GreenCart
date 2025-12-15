import axiosInstance from "@/utils/axios";
import { getApiErrorMessage } from "@/utils/errorMessage";

export const toggleWishlist = async (productId: string) => {
    try {
        const response = await axiosInstance.post(`/users/wishlist/${productId}`);
        return response.data;
    } catch (error) {
        const errorMessage = getApiErrorMessage(error, "찜 상품 전환 중 오류가 발생했습니다.");
        throw new Error(errorMessage);
    }
};

export const getWishlist = async () => {
    try {
        const response = await axiosInstance.get("/users/wishlist");
        return response.data;
    } catch (error) {
        const errorMessage = getApiErrorMessage(error, "찜 목록 읽어오기 실패했습니다.");
        throw new Error(errorMessage);
    }
};
