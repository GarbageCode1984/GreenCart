export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: string;
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

export interface Product {
    name: string;
    price: number;
    description?: string;
    category?: string;
    images?: File[];
    categoryId: string;
}

export interface Category {
    id: string;
    name: string;
}
