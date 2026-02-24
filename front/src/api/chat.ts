import axiosInstance from "@/utils/axios";

export const createConversation = async (data: { senderId: string; receiverId: string; productId: string }) => {
    const response = await axiosInstance.post("/chat/conversation", data);
    return response.data;
};

export const getUserConversations = async (userId: string) => {
    const response = await axiosInstance.get(`/chat/conversations/${userId}`);
    return response.data;
};

export const getMessages = async (conversationId: string) => {
    const response = await axiosInstance.get(`/chat/messages/${conversationId}`);
    return response.data;
};

export const sendMessageApi = async (messageData: { conversationId: string; sender: string; text: string }) => {
    const response = await axiosInstance.post("/chat/message", messageData);
    return response.data;
};

export const leaveConversationApi = async (conversationId: string) => {
    const response = await axiosInstance.put(`/chat/conversation/${conversationId}/leave`);
    return response.data;
};
