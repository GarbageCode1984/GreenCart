import axiosInstance from "@/utils/axois";
import { Product } from "@/types/types";
import { getApiErrorMessage } from "@/utils/errorMessage";

export const createProduct = async (data: FormData) => {
    try {
        const response = await axiosInstance.post("/products/create", data);
        return response.data;
    } catch (error) {
        const errorMessage = getApiErrorMessage(error, "상품 등록 처리 중 오류가 발생했습니다.");
        throw new Error(errorMessage);
    }
};

export const getAllProducts = async (): Promise<Product[]> => {
    try {
        const response = await axiosInstance.get("/products/findAllProduct");
        return response.data.products;
    } catch (error) {
        const errorMessage = getApiErrorMessage(error, "상품 목록을 불러오는 데 실패했습니다.");

        console.error("상품 목록 API 호출 실패", error);
        throw new Error(errorMessage);
    }
};
