import { ServerErrorResponseData } from "@/types/types";
import axiosInstance from "@/utils/axois";
import { AxiosError } from "axios";
import { Product } from "@/types/types";
import axiosInstance from "@/utils/axois";

export const createProduct = async (data: FormData) => {
    try {
        const response = await axiosInstance.post("/products/create", data);
        return response.data;
    } catch (error) {
        let errorMessage = "상품등록 실패";

        if (error instanceof AxiosError) {
            const serverResponseData = error.response?.data as ServerErrorResponseData;
            if (serverResponseData?.message) {
                errorMessage = serverResponseData.message;
            } else {
                errorMessage = `상품등록 실패: ${error.message}`;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
};

export const getAllProducts = async (): Promise<Product[]> => {
    try {
        const response = await axiosInstance.get("/products");
        return response.data.products;
    } catch (error) {
        let errorMessage = "상품 데이터를 불러오는 데 실패 했습니다.";

        if (error instanceof AxiosError) {
            const serverResponseData = error.response?.data as ServerErrorResponseData;
            if (serverResponseData?.message) {
                errorMessage = serverResponseData.message;
            }
        }

        console.error("상품 목록 API 호출 실패", error);
        throw new Error(errorMessage);
    }
};
