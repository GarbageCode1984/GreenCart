import { ServerErrorResponseData } from "@/types/types";
import axiosInstance from "@/utils/axois";
import { AxiosError } from "axios";

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
