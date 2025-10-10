import { AxiosError } from "axios";
import { ServerErrorResponseData } from "../types/types";

export const getApiErrorMessage = (
    error: unknown,
    defaultMessage: string = "요청 처리 중 알 수 없는 오류가 발생했습니다."
): string => {
    let errorMessage = defaultMessage;

    if (error instanceof AxiosError) {
        const serverResponseData = error.response?.data as ServerErrorResponseData;
        if (serverResponseData?.message) {
            errorMessage = serverResponseData.message;
        } else if (error.message) {
            errorMessage = `네트워크 오류: ${error.message}`;
        }
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    console.error("API 호출 중 상세 에러:", error);
    return errorMessage;
};
