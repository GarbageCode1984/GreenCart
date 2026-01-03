import axiosInstance from "@/utils/axios";
import { Product, SearchResponse } from "@/types/types";
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

export const getAllProducts = async (page: number = 1, limit: number = 12): Promise<SearchResponse> => {
    try {
        const response = await axiosInstance.get("/products/findAllProduct", {
            params: { page, limit },
        });
        return response.data;
    } catch (error) {
        const errorMessage = getApiErrorMessage(error, "상품 목록을 불러오는 데 실패했습니다.");

        console.error("상품 목록 API 호출 실패", error);
        throw new Error(errorMessage);
    }
};

export const getProductById = async (productId: string): Promise<Product> => {
    try {
        const response = await axiosInstance.get(`/products/getProductDetail/${productId}`);
        return response.data.product;
    } catch (error) {
        const errorMessage = getApiErrorMessage(error, "상품 상세 정보를 불러오는 데 실패했습니다.");

        console.error(`상품 ID ${productId} 조회 API 호출 실패`, error);
        throw new Error(errorMessage);
    }
};

export const updateProduct = async (productId: string, data: FormData) => {
    try {
        const response = await axiosInstance.patch(`/products/update/${productId}`, data);
        return response.data;
    } catch (error) {
        const errorMessage = getApiErrorMessage(error, "상품 수정 처리 중 오류가 발생했습니다.");
        throw new Error(errorMessage);
    }
};

export const deleteProduct = async (productId: string) => {
    try {
        const response = await axiosInstance.delete(`/products/delete/${productId}`);
        return response.data;
    } catch (error) {
        const errorMessage = getApiErrorMessage(error, "상품 삭제 처리 중 오류가 발생했습니다.");
        throw new Error(errorMessage);
    }
};

export const searchProduct = async (keyword: string, page: number = 1, limit: number = 12): Promise<SearchResponse> => {
    if (!keyword) return { products: [], totalPages: 0, totalCount: 0, currentPage: 1 };

    try {
        const response = await axiosInstance.get(`/products/search`, {
            params: { q: keyword, page, limit },
        });

        return response.data;
    } catch (error) {
        const errorMessage = getApiErrorMessage(error, "상품 검색 실패");
        throw new Error(errorMessage);
    }
};

export const getMyProducts = async (): Promise<Product[]> => {
    const response = await axiosInstance.get("/products/myProducts");
    return response.data.products;
};

export const updateProductStatus = async (productId: string, status: "FOR_SALE" | "SOLD_OUT") => {
    const response = await axiosInstance.patch(`/products/status/${productId}`, { status });
    return response.data.product;
};
