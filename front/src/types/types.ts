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
    createdAt: string | number | Date;
    _id: string;
    name: string;
    price: number;
    region: string;
    province?: string;
    city?: string;
    hashtag: string;
    description?: string;
    images: (File | undefined)[] | null;
    sellerId: string;
    sellerName: string;
    status: string;
}

export interface SearchResponse {
    products: Product[];
    totalPages: number;
    totalCount: number;
    currentPage: number;
}

export interface Category {
    id: string;
    name: string;
}
export interface Message {
    _id?: string;
    conversationId: string;
    sender: string;
    text: string;
    createdAt: string;
}

export interface Conversation {
    _id: string;
    members: string[];
    productId: {
        _id: string;
        name: string;
        images: string[];
        sellerId: string;
    };
    updatedAt: string;
}
