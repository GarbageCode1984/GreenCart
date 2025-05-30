import axiosInstance from "@/utils/axois";
import { AxiosError } from "axios";

import { LoginFormData, RegisterFormData, ServerErrorResponseData } from "../types/types";

export async function registerUser(data: RegisterFormData) {
    try {
        const response = await axiosInstance.post("/users/register", data);
        return response.data;
    } catch (error: unknown) {
        let errorMessage = "회원가입 중 알 수 없는 오류가 발생했습니다.";

        if (error instanceof AxiosError) {
            const serverResponseData = error.response?.data as ServerErrorResponseData;
            if (serverResponseData?.message) {
                errorMessage = serverResponseData.message;
            } else {
                errorMessage = `회원가입 실패: ${error.message}`;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
}

export async function loginUser(data: LoginFormData) {
    try {
        const response = await axiosInstance.post("/users/login", {
            email: data.email,
            password: data.password,
        });
        return response.data;
    } catch (error: unknown) {
        let errorMessage = "로그인 중 알 수 없는 오류가 발생했습니다.";

        if (error instanceof AxiosError) {
            const serverResponseData = error.response?.data as ServerErrorResponseData;
            if (serverResponseData?.message) {
                errorMessage = serverResponseData.message;
            } else {
                errorMessage = `로그인 실패: ${error.message}`;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
}
