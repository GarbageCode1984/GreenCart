import { getMyProducts, updateProductStatus } from "@/api/products";
import { colors } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { Conversation, Product } from "@/types/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import ProfileEdit from "./ProfileEdit";
import { getUserConversations } from "@/api/chat";

const MyPage = () => {
    const navigate = useNavigate();
    const { isAuth, userData } = useAuthStore();

    const [activeTab, setActiveTab] = useState<"sales" | "info" | "chat">("sales");
    const [myProducts, setMyProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        if (!isAuth) {
            toast.warning("로그인이 필요합니다.");
            navigate("/login");
            return;
        }

        const getMyData = async () => {
            if (activeTab === "info") return;

            setIsLoading(true);

            try {
                if (activeTab === "sales") {
                    const products = await getMyProducts();
                    setMyProducts(products);
                } else if (activeTab === "chat" && userData?._id) {
                    const chatList = await getUserConversations(userData._id);
                    setConversations(chatList);
                }
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        getMyData();
    }, [isAuth, activeTab, navigate, userData?._id]);

    const handleStatusToggle = async (productId: string, currentStatus: "FOR_SALE" | "SOLD_OUT") => {
        const newStatus = currentStatus === "FOR_SALE" ? "SOLD_OUT" : "FOR_SALE";

        try {
            await updateProductStatus(productId, newStatus);
            setMyProducts((prev) => prev.map((p) => (p._id === productId ? { ...p, status: newStatus } : p)));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <Sidebar>
                <ProfileSection>
                    <ProfileIcon>👤</ProfileIcon>
                    <UserName>{userData?.name || "사용자"}님</UserName>
                    <UserEmail>{userData?.email}</UserEmail>
                </ProfileSection>
                <Menu>
                    <MenuItem $active={activeTab === "sales"} onClick={() => setActiveTab("sales")}>
                        📦 판매 내역 관리
                    </MenuItem>
                    <MenuItem $active={activeTab === "info"} onClick={() => setActiveTab("info")}>
                        ⚙️ 내 정보 수정
                    </MenuItem>
                    <MenuItem $active={activeTab === "chat"} onClick={() => setActiveTab("chat")}>
                        💬 1:1 대화방
                    </MenuItem>
                </Menu>
            </Sidebar>

            <ContentArea>
                <PageTitle>
                    {activeTab === "sales" && "나의 판매 내역"}
                    {activeTab === "info" && "내 정보 수정"}
                    {activeTab === "chat" && "1:1 대화방"}
                </PageTitle>

                {activeTab === "sales" && (
                    <ProductList>
                        {isLoading ? (
                            <LoadingText>상품 목록을 불러오는 중입니다...</LoadingText>
                        ) : myProducts.length > 0 ? (
                            myProducts.map((product) => (
                                <ProductItem key={product._id} $isSoldOut={product.status === "SOLD_OUT"}>
                                    <ImageWrapper onClick={() => navigate(`/products/${product._id}`)}>
                                        {product.images?.[0] ? (
                                            <ProductImg src={product.images[0]} alt={product.name} />
                                        ) : (
                                            <NoImage>No Image</NoImage>
                                        )}
                                        {product.status === "SOLD_OUT" && <SoldOutOverlay>판매완료</SoldOutOverlay>}
                                    </ImageWrapper>

                                    <Info>
                                        <TopRow>
                                            <StatusBadge $status={product.status}>
                                                {product.status === "FOR_SALE" ? "🟢 판매중" : "🔴 판매완료"}
                                            </StatusBadge>
                                            <DateText>{new Date(product.createdAt).toLocaleDateString()}</DateText>
                                        </TopRow>

                                        <Title onClick={() => navigate(`/products/${product._id}`)}>
                                            {product.name}
                                        </Title>
                                        <Price>{product.price.toLocaleString()}원</Price>

                                        <ActionButtons>
                                            <ActionButton
                                                onClick={() =>
                                                    handleStatusToggle(
                                                        product._id,
                                                        product.status as "FOR_SALE" | "SOLD_OUT",
                                                    )
                                                }
                                                $active={product.status === "FOR_SALE"}
                                            >
                                                {product.status === "FOR_SALE" ? "판매완료로 변경" : "판매중으로 변경"}
                                            </ActionButton>
                                        </ActionButtons>
                                    </Info>
                                </ProductItem>
                            ))
                        ) : (
                            <EmptyState>등록된 상품이 없습니다.</EmptyState>
                        )}
                    </ProductList>
                )}

                {activeTab === "info" && (
                    <EmptyState>
                        <ProfileEdit />
                    </EmptyState>
                )}

                {activeTab === "chat" && (
                    <ChatListContainer>
                        {isLoading ? (
                            <LoadingText>채팅방 목록을 불러오는 중입니다...</LoadingText>
                        ) : conversations.length > 0 ? (
                            conversations.map((chat) => (
                                <ChatItem key={chat._id} onClick={() => navigate(`/chat/${chat._id}`)}>
                                    <ChatAvatarWrapper>
                                        {chat.productId?.images?.[0] ? (
                                            <ChatAvatar src={chat.productId.images[0]} alt="상품 이미지" />
                                        ) : (
                                            <NoAvatarImage>
                                                No
                                                <br />
                                                Image
                                            </NoAvatarImage>
                                        )}
                                    </ChatAvatarWrapper>
                                    <ChatInfo>
                                        <ChatProductName>{chat.productId?.name || "알 수 없는 상품"}</ChatProductName>
                                        <ChatLastMessage>대화방에 입장하여 메시지를 확인해보세요.</ChatLastMessage>
                                    </ChatInfo>
                                    <ChatEnterButton>입장하기</ChatEnterButton>
                                </ChatItem>
                            ))
                        ) : (
                            <EmptyState>
                                현재 참여 중인 1:1 대화방이 없습니다.
                                <br />
                                상품 페이지에서 '판매자에게 연락하기'를 눌러 대화를 시작해보세요!
                            </EmptyState>
                        )}
                    </ChatListContainer>
                )}
            </ContentArea>
        </Container>
    );
};

export default MyPage;

/* 
    판매 내역 관리
    기능 : 내가 등록한 상품들을 리스트로 보여준다
    핵심 액션 :
        판매중 <--> 판매완료 상태를 변경해야 한다
        내가 팔고 있는 상품을 클릭시 상품 디테일 페이지로 이동 해야 한다
    
    내 정보 수정
    기능 : 닉네임 변경, 비밀번호 변경, 회원 탈퇴
*/

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    display: flex;
    gap: 40px;
    min-height: 80vh;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const Sidebar = styled.div`
    width: 250px;
    flex-shrink: 0;
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const ProfileSection = styled.div`
    text-align: center;
    padding: 30px 20px;
    background-color: ${colors.WHITE};
    border-radius: 12px;
    margin-bottom: 20px;
    border: 1px solid ${colors.GRAY_75};
`;

const ProfileIcon = styled.div`
    font-size: 3rem;
    margin-bottom: 10px;
`;

const UserName = styled.h3`
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 5px;
    color: ${colors.BLACK_100};
`;

const UserEmail = styled.p`
    font-size: 0.9rem;
    color: ${colors.GRAY_200};
`;

const Menu = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const MenuItem = styled.button<{ $active: boolean }>`
    width: 100%;
    padding: 15px;
    text-align: left;
    background-color: ${(props) => (props.$active ? colors.GREEN_100 : colors.WHITE)};
    color: ${(props) => (props.$active ? colors.WHITE : colors.BLACK_100)};
    border: 1px solid ${(props) => (props.$active ? colors.GREEN_100 : colors.GRAY_75)};
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: ${(props) => (props.$active ? colors.GREEN_100 : colors.GRAY_50)};
        color: ${(props) => (props.$active ? colors.WHITE : colors.BLACK_100)};
    }
`;

const ContentArea = styled.div`
    flex: 1;
`;

const PageTitle = styled.h2`
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 30px;
    border-bottom: 2px solid #eee;
    padding-bottom: 15px;
    color: #333;
`;

const ProductList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ProductItem = styled.div<{ $isSoldOut?: boolean }>`
    display: flex;
    gap: 20px;
    padding: 20px;
    border: 1px solid ${colors.WHITE_100};
    border-radius: 12px;
    background-color: ${colors.WHITE};
    align-items: center;
    transition: box-shadow 0.2s;
    opacity: ${(props) => (props.$isSoldOut ? 0.8 : 1)};

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    @media (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const ImageWrapper = styled.div`
    width: 120px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    flex-shrink: 0;
    background-color: #f8f8f8;
`;

const ProductImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const NoImage = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 0.8rem;
    background-color: #f0f0f0;
`;

const SoldOutOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 0.9rem;
`;

const Info = styled.div`
    flex: 1;
    width: 100%;
`;

const TopRow = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
`;

const StatusBadge = styled.span<{ $status: string }>`
    font-size: 0.8rem;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: ${(props) => (props.$status === "FOR_SALE" ? "#e6f4ea" : "#f1f3f4")};
    color: ${(props) => (props.$status === "FOR_SALE" ? colors.GREEN_100 : "#666")};
`;

const DateText = styled.span`
    font-size: 0.85rem;
    color: #999;
`;

const Title = styled.h3`
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 8px;
    cursor: pointer;
    color: #333;
`;

const Price = styled.div`
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 15px;
    color: ${colors.BLUE_200};
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $danger?: boolean; $active?: boolean }>`
    padding: 8px 12px;
    font-size: 0.85rem;
    border: 1px solid ${(props) => (props.$danger ? "#ffcccc" : "#ddd")};
    background-color: ${(props) => (props.$danger ? "#fff5f5" : props.$active ? colors.GREEN_100 : "white")};
    color: ${(props) => (props.$danger ? "red" : props.$active ? "white" : "#555")};
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;

    &:hover {
        opacity: 0.9;
        background-color: ${(props) => (props.$danger ? "#ffecec" : props.$active ? colors.GREEN_100 : "#f0f0f0")};
    }
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 100px 0;
    color: #999;
    font-size: 1.1rem;
`;

const LoadingText = styled.div`
    text-align: center;
    padding: 50px;
    color: #888;
`;

const ChatListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const ChatItem = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 12px;
    background-color: white;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border-color: ${colors.GREEN_100 || "#2E7D32"};
    }
`;

const ChatAvatarWrapper = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background-color: #f5f5f5;
    margin-right: 20px;
    border: 1px solid #eee;
`;

const ChatAvatar = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const NoAvatarImage = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #bbb;
    font-size: 0.75rem;
    text-align: center;
`;

const ChatInfo = styled.div`
    flex: 1;
`;

const ChatProductName = styled.h3`
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 6px;
`;

const ChatLastMessage = styled.p`
    font-size: 0.9rem;
    color: #777;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 90%;
`;

const ChatEnterButton = styled.button`
    padding: 8px 16px;
    border-radius: 20px;
    background-color: ${colors.GREEN_50 || "#e8f5e9"};
    color: ${colors.GREEN_300 || "#1b5e20"};
    border: none;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;

    ${ChatItem}:hover & {
        background-color: ${colors.GREEN_100 || "#2E7D32"};
        color: white;
    }
`;
