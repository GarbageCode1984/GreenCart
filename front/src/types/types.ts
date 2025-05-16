export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface ServerErrorResponseData {
    message: string;
    details?: string | string[];
    error?: string;
}
