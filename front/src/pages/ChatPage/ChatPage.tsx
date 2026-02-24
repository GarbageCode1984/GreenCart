import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../../store/useAuthStore";
import { getUserConversations, getMessages, sendMessageApi, leaveConversationApi } from "../../api/chat";
import { colors } from "../../constants";
import { useParams, useNavigate } from "react-router-dom";
import { FiSend, FiLogOut } from "react-icons/fi";
import { Message, Conversation } from "../../types/types";
import { SERVER_URL } from "@/constants";

const ChatPage = () => {
    const { userData: user } = useAuthStore();
    const { conversationId } = useParams();
    const navigate = useNavigate();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentChat, setCurrentChat] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");

    const socket = useRef<Socket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const getProductImageUrl = (path: string | undefined) => {
        if (!path) return undefined;
        if (path.startsWith("http")) return path;
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        return `${SERVER_URL}${cleanPath}`;
    };

    // 소켓 초기화 및 사용자 등록
    useEffect(() => {
        socket.current = io(SERVER_URL, {
            transports: ["websocket"],
            reconnection: true,
            path: "/socket.io/",
        });

        socket.current.on("connect", () => {
            if (user?._id) {
                socket.current?.emit("addUser", user._id);
            }
        });

        return () => {
            if (socket) {
                socket.current?.off("receiveMessage");
                // socket.disconnect(); // 필요에 따라 주석 처리하거나 신중히 사용
            }
        };
    }, [user?._id]);

    // 채팅방 변경 시 메시지 로드 및 룸 조인
    useEffect(() => {
        if (!currentChat || !socket.current) return;
        const roomId = currentChat._id;
        socket.current.emit("join_room", roomId);

        const fetchMessages = async () => {
            try {
                const res = await getMessages(roomId);
                setMessages(res);
            } catch (err) {
                console.error(err);
            }
        };
        fetchMessages();

        const handleReceiveMessage = (data: Message) => {
            if (data.conversationId === roomId) {
                setMessages((prev) => {
                    const isDuplicate = prev.some((m) => m._id === data._id);
                    if (isDuplicate) return prev;
                    return [...prev, data];
                });
            }
        };

        socket.current.on("receive_message", handleReceiveMessage);
        return () => {
            socket.current?.off("receive_message", handleReceiveMessage);
        };
    }, [currentChat]);

    // 전체 대화 목록 로드
    useEffect(() => {
        const getConversations = async () => {
            if (!user?._id) return;
            try {
                const res = await getUserConversations(user._id);
                setConversations(res);
            } catch (err) {
                console.error(err);
            }
        };
        getConversations();
    }, [user?._id]);

    // URL 파라미터에 따른 현재 채팅방 설정
    useEffect(() => {
        if (conversationId && conversations.length > 0) {
            const target = conversations.find((c) => c._id === conversationId);
            if (target) setCurrentChat(target);
        }
    }, [conversationId, conversations]);

    // 새 메시지 수신 시 스크롤 하단 이동
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleLeaveChat = async () => {
        if (!currentChat || !window.confirm("정말로 채팅방을 나가시겠습니까?")) return;
        try {
            await leaveConversationApi(currentChat._id);
            setConversations((prev) => prev.filter((c) => c._id !== currentChat._id));
            setCurrentChat(null);
            navigate("/chat");
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentChat || !user) return;

        // 알림 전송을 위해 수신자 ID 추출
        const receiverId = currentChat.members.find((id) => id !== user._id);

        const messageData = {
            conversationId: currentChat._id,
            sender: user._id,
            text: newMessage,
        };

        setNewMessage("");

        try {
            const savedMessage = await sendMessageApi(messageData);

            // 실시간 알림을 위한 추가 데이터 포함
            const fullMessage = {
                ...savedMessage,
                receiverId,
                senderName: user.name,
            };

            setMessages((prev) => [...prev, savedMessage]);
            socket.current?.emit("send_message", fullMessage);
        } catch (err) {
            console.error(err);
            setNewMessage(messageData.text);
        }
    };

    return (
        <Container>
            <ChatMenu>
                <MenuHeader>채팅 목록</MenuHeader>
                <ConversationList>
                    {conversations.map((c) => (
                        <ConversationItem
                            key={c._id}
                            $active={c._id === currentChat?._id}
                            onClick={() => navigate(`/chat/${c._id}`)}
                        >
                            {/* <Avatar src={getProductImageUrl(c.productId?.images?.[0]) || ""} alt="product" />
                             */}

                            {c.productId?.images?.[0] ? (
                                <Avatar src={getProductImageUrl(c.productId.images[0])} alt="product" />
                            ) : (
                                <NoAvatarImage>
                                    NO
                                    <br />
                                    IMAGE
                                </NoAvatarImage>
                            )}
                            <ConversationInfo>
                                <ChatName>{c.productId?.name || "알 수 없는 상품"}</ChatName>
                                <LastMessage>대화를 확인해보세요</LastMessage>
                            </ConversationInfo>
                        </ConversationItem>
                    ))}
                </ConversationList>
            </ChatMenu>

            <ChatBox>
                {currentChat ? (
                    <>
                        <ChatHeader>
                            <HeaderLeft>
                                <HeaderProductInfo onClick={() => navigate(`/products/${currentChat.productId?._id}`)}>
                                    {currentChat.productId?.images?.[0] ? (
                                        <HeaderImg
                                            src={getProductImageUrl(currentChat.productId.images[0])}
                                            alt="product"
                                        />
                                    ) : (
                                        <NoHeaderImage>
                                            NO
                                            <br />
                                            IMAGE
                                        </NoHeaderImage>
                                    )}
                                    <div>
                                        <HeaderProductName>{currentChat.productId?.name}</HeaderProductName>
                                        <span style={{ fontSize: "0.8rem", color: "#888" }}>상품 보러가기 &gt;</span>
                                    </div>
                                </HeaderProductInfo>
                            </HeaderLeft>
                            <LeaveButton onClick={handleLeaveChat} title="채팅방 나가기">
                                <FiLogOut /> 나가기
                            </LeaveButton>
                        </ChatHeader>

                        <MessagesContainer>
                            {messages.map((m) => {
                                const isOwn = m.sender === user?._id;
                                return (
                                    <MessageRow key={m._id ?? m.createdAt} $own={isOwn}>
                                        <MessageBubble $own={isOwn}>{m.text}</MessageBubble>
                                        <MessageTime>
                                            {new Date(m.createdAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </MessageTime>
                                    </MessageRow>
                                );
                            })}
                            <div ref={scrollRef} />
                        </MessagesContainer>

                        <ChatInputForm onSubmit={handleSubmit}>
                            <Input
                                placeholder="메시지를 입력하세요..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <SendButton type="submit">
                                <FiSend />
                            </SendButton>
                        </ChatInputForm>
                    </>
                ) : (
                    <NoChatSelected>채팅방을 선택하거나 상품 페이지에서 문의하기를 눌러주세요.</NoChatSelected>
                )}
            </ChatBox>
        </Container>
    );
};

export default ChatPage;

const Container = styled.div`
    display: flex;
    height: calc(100vh - 80px);
    max-width: 1200px;
    margin: 0 auto;
    border: 1px solid #eee;
    background-color: #fff;
`;
const ChatMenu = styled.div`
    flex: 1;
    max-width: 300px;
    border-right: 1px solid #eee;
    display: flex;
    flex-direction: column;
    @media (max-width: 768px) {
        display: none;
    }
`;
const MenuHeader = styled.div`
    padding: 20px;
    font-weight: 700;
    font-size: 1.2rem;
    border-bottom: 1px solid #eee;
`;
const ConversationList = styled.div`
    overflow-y: auto;
    flex: 1;
`;
const ConversationItem = styled.div<{ $active: boolean }>`
    display: flex;
    align-items: center;
    padding: 15px 20px;
    cursor: pointer;
    background-color: ${(p) => (p.$active ? "#f0fdf4" : "white")};
    &:hover {
        background-color: #f8f9fa;
    }
`;
const Avatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 15px;
    object-fit: cover;
    background-color: #ddd;
`;
const ConversationInfo = styled.div`
    display: flex;
    flex-direction: column;
`;
const ChatName = styled.span`
    font-weight: 600;
    font-size: 0.95rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 180px;
`;
const LastMessage = styled.span`
    font-size: 0.8rem;
    color: #888;
`;
const ChatBox = styled.div`
    flex: 3;
    display: flex;
    flex-direction: column;
`;
const ChatHeader = styled.div`
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    background-color: #fcfcfc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
`;
const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
`;
const HeaderProductInfo = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 8px;
    &:hover {
        background-color: #f0f0f0;
    }
`;
const HeaderImg = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 4px;
    object-fit: cover;
    margin-right: 10px;
`;
const HeaderProductName = styled.span`
    font-weight: 600;
`;
const LeaveButton = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 0.85rem;
    color: #666;
    cursor: pointer;
`;
const MessagesContainer = styled.div`
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;
const MessageRow = styled.div<{ $own: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: ${(p) => (p.$own ? "flex-end" : "flex-start")};
    align-self: ${(p) => (p.$own ? "flex-end" : "flex-start")};
    max-width: 70%;
`;
const MessageBubble = styled.div<{ $own: boolean }>`
    padding: 10px 15px;
    border-radius: 18px;
    background-color: ${(p) => (p.$own ? colors?.GREEN_100 || "#2E7D32" : "#f1f3f5")};
    color: ${(p) => (p.$own ? "white" : "#333")};
`;
const MessageTime = styled.span`
    font-size: 0.7rem;
    color: #aaa;
    margin-top: 4px;
`;
const ChatInputForm = styled.form`
    padding: 20px;
    border-top: 1px solid #eee;
    display: flex;
    gap: 10px;
`;
const Input = styled.input`
    flex: 1;
    padding: 12px 15px;
    border-radius: 24px;
    border: 1px solid #ddd;
    outline: none;
`;
const SendButton = styled.button`
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background-color: ${colors?.GREEN_100 || "#2E7D32"};
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;
const NoChatSelected = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
`;

const NoAvatarImage = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f5f5f5;
    border: 1px solid #eee;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #bbb;
    font-size: 0.65rem;
    font-weight: 600;
    text-align: center;
    line-height: 1.1;
    margin-right: 15px;
`;

const NoHeaderImage = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 6px;
    background-color: #f5f5f5;
    border: 1px solid #eee;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #bbb;
    font-size: 0.65rem;
    font-weight: 600;
    text-align: center;
    line-height: 1.1;
    margin-right: 10px;
`;
