import { deleteProduct, getProductById } from "@/api/products";
import { toggleWishlist } from "@/api/wishlist";
import CustomButton from "@/components/Common/CustomButton";
import { colors } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { Product } from "@/types/types";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { createConversation } from "@/api/chat";

const parseHashtags = (hashtagString: string | undefined): string[] => {
    if (!hashtagString) return [];
    return hashtagString
        .split(/[\s,]+/)
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
};

const ProductDetailPage = () => {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();
    const { isAuth, userData, setUser } = useAuthStore();
    const [isWished, setIsWished] = useState(false);

    const UserId = useAuthStore((store) => store.userData?._id);
    const isOwner = useMemo(() => {
        return product && UserId && product.sellerId === UserId;
    }, [product, UserId]);

    useEffect(() => {
        if (!productId) {
            setError("상품 ID가 유효하지 않습니다.");
            setLoading(false);
            return;
        }

        const getProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getProductById(productId);
                setProduct(response);
            } catch (error) {
                setError(error.message);
                toast.error(`상품 정보를 불러오지 못했습니다.`);
            } finally {
                setLoading(false);
            }
        };

        getProduct();
    }, [productId]);

    useEffect(() => {
        if (userData && userData.wishlist && productId) {
            setIsWished(userData.wishlist.includes(productId));
        } else {
            setIsWished(false);
        }
    }, [userData, productId]);

    if (loading) {
        return (
            <DetailContainer>
                <MessageBox>상품 정보를 불러오는 중입니다... 🚀</MessageBox>
            </DetailContainer>
        );
    }
    if (error || !product) {
        return (
            <DetailContainer>
                <MessageBox role="alert" isError={!!error}>
                    {error || "상품 정보를 찾을 수 없습니다."}
                </MessageBox>
            </DetailContainer>
        );
    }

    const handleImageChange = (index: number) => {
        setCurrentImageIndex(index);
    };

    const handleContactSeller = async () => {
        if (!isAuth || !userData) {
            toast.warning("로그인이 필요한 서비스입니다.");
            return;
        }
        if (!product) return;

        if (userData._id === product.sellerId) {
            toast.warning("본인 상품에는 문의할 수 없습니다.");
            return;
        }

        try {
            const conversation = await createConversation({
                senderId: userData._id,
                receiverId: product.sellerId,
                productId: product._id,
            });

            navigate(`/chat/${conversation._id}`);
        } catch (error) {
            console.error("채팅방 생성 실패:", error);
            toast.error("채팅방으로 이동할 수 없습니다.");
        }
    };

    const handleAddToWishlist = async () => {
        if (!isAuth) {
            toast.warning("로그인이 필요합니다.");
            return;
        }

        if (!productId) return;

        try {
            const nextState = !isWished;
            setIsWished(nextState);

            const data = await toggleWishlist(productId);

            if (data.wishlist && userData) {
                setUser({ ...userData, wishlist: data.wishlist });
            }

            if (nextState) {
                toast.info("관심 상품에 등록되었습니다.");
            } else {
                toast.info("관심 상품이 해제되었습니다.");
            }
        } catch (error) {
            console.error("찜하기 실패:", error);
            setIsWished(!isWished);
            toast.error("오류가 발생했습니다.");
        }
    };

    const handleEdit = () => {
        try {
            if (!isOwner || !product) return;
            if (product.status === "SOLD_OUT") {
                toast.warning("판매 완료된 상품은 수정할 수 없습니다.");
                return;
            }

            if (product) {
                navigate(`/seller/edit-product/${product._id}`, { state: { productToEdit: product } });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleNextImage = () => {
        if (!product || !product.images || product.images.length <= 1) return;

        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images!.length);
    };
    const handlePrevImage = () => {
        if (!product || !product.images || product.images.length <= 1) return;

        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images!.length) % product.images!.length);
    };

    const handleDelete = async () => {
        if (!product || !product._id) return;
        if (product.status === "SOLD_OUT") {
            toast.warning("판매 완료된 상품은 삭제할 수 없습니다.");
            return;
        }

        const confirmDelete = window.confirm("정말로 이 상품을 삭제하시겠습니까?\n 삭제된 상품은 복구가 불가능합니다.");

        if (confirmDelete) {
            try {
                await deleteProduct(product._id);
                toast.success("상품이 삭제되었습니다.");
                navigate("/");
            } catch (error) {
                console.error("상품 삭제 실패:", error);
                toast.error(`상품 삭제에 실패했습니다: ${error.message || "알 수 없는 오류"}`);
            }
        }
    };

    const tags = parseHashtags(product.hashtag);

    return (
        <DetailContainer>
            <DetailWrapper>
                <ImageSection>
                    <ImageCarousel>
                        {product.images && product.images.length > 1 && (
                            <>
                                <SlideButton direction="prev" onClick={handlePrevImage}>
                                    &lt;
                                </SlideButton>
                                <SlideButton direction="next" onClick={handleNextImage}>
                                    &gt;
                                </SlideButton>
                            </>
                        )}

                        {product.images && product.images.length > 0 ? (
                            <ProductImage src={`${product.images[currentImageIndex]}`} alt={product.name} />
                        ) : (
                            <NoImagePlaceholder>No Image</NoImagePlaceholder>
                        )}

                        {product.status === "SOLD_OUT" && (
                            <SoldOverlay>
                                <SoldText>판매완료</SoldText>
                            </SoldOverlay>
                        )}
                    </ImageCarousel>

                    {product.images && product.images.length > 1 && (
                        <ThumbnailList>
                            {product.images.map((image, index) => (
                                <ThumbnailItem
                                    key={index}
                                    src={`${image}`}
                                    alt={`Thumbnail ${index}`}
                                    isActive={index === currentImageIndex}
                                    onClick={() => handleImageChange(index)}
                                />
                            ))}
                        </ThumbnailList>
                    )}
                </ImageSection>

                <InfoSection>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>₩{product.price.toLocaleString()}</ProductPrice>

                    <ProductMeta>
                        <MetaItem>
                            <label>판매자:</label>
                            <span style={{ fontWeight: 700, color: colors.GREEN_200 }}>
                                {product.sellerName || "정보 없음"}
                            </span>
                        </MetaItem>

                        <MetaItem style={{ marginTop: "10px" }}>
                            <label>지역:</label>
                            <span>{product.region || "정보 없음"}</span>
                        </MetaItem>

                        <MetaItem>
                            <label style={{ marginTop: "2px" }}>해시태그:</label>
                            {tags.length > 0 && (
                                <HashtagContainer>
                                    {tags.map((tag, index) => (
                                        <Hashtag key={index}>#{tag}</Hashtag>
                                    ))}
                                </HashtagContainer>
                            )}
                        </MetaItem>

                        <MetaItem>
                            <label>등록일:</label>
                            <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                        </MetaItem>
                    </ProductMeta>

                    <ButtonContainer>
                        {isOwner ? (
                            <>
                                <CustomButton variant="green" onClick={handleEdit}>
                                    상품 수정하기
                                </CustomButton>
                                <CustomButton variant="red" onClick={handleDelete}>
                                    상품 삭제
                                </CustomButton>
                            </>
                        ) : (
                            <>
                                <CustomButton
                                    variant="green"
                                    onClick={handleContactSeller}
                                    disabled={product.status === "SOLD_OUT"}
                                >
                                    판매자에게 연락하기
                                </CustomButton>
                                <CustomButton
                                    variant={isWished ? "gray" : "blue"}
                                    onClick={handleAddToWishlist}
                                    disabled={product.status === "SOLD_OUT"}
                                >
                                    {isWished ? "관심 상품 해제" : "관심 상품 등록"}
                                </CustomButton>
                            </>
                        )}
                    </ButtonContainer>
                </InfoSection>
            </DetailWrapper>

            <DescriptionSection>
                <h2>상품 상세 정보</h2>
                <DescriptionContent>{product.description || "등록된 상세 설명이 없습니다."}</DescriptionContent>
            </DescriptionSection>
        </DetailContainer>
    );
};

const DetailContainer = styled.div`
    max-width: 1000px;
    margin: 40px auto;
    padding: 20px;
    min-height: 80vh;
`;

const DetailWrapper = styled.div`
    display: flex;
    gap: 40px;
    margin-bottom: 50px;

    @media (max-width: 900px) {
        flex-direction: column;
    }
`;

const ImageSection = styled.div`
    flex: 1;
    min-width: 450px;
    @media (max-width: 900px) {
        min-width: 100%;
    }
`;

const ImageCarousel = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ProductImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
`;

const NoImagePlaceholder = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    color: ${colors.GRAY_100};
    background-color: ${colors.GRAY_50};
`;

const ThumbnailList = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 15px;
    overflow-x: auto;
    padding-bottom: 5px;
`;

const ThumbnailItem = styled.img<{ isActive: boolean }>`
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid ${(props) => (props.isActive ? colors.BLUE_100 : "transparent")};
    opacity: ${(props) => (props.isActive ? 1 : 0.7)};
    transition: all 0.2s;

    &:hover {
        opacity: 1;
    }
`;

const InfoSection = styled.div`
    flex: 1;
`;

const SlideButton = styled.button<{ direction: "prev" | "next" }>`
    position: absolute;
    top: 50%;
    ${(props) => (props.direction === "prev" ? "left: 10px;" : "right: 10px;")};
    transform: translateY(-50%);
    z-index: 10;

    background: rgba(0, 0, 0, 0.6);
    color: ${colors.WHITE};
    border: none;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    font-size: 2em;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;

    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: rgba(0, 0, 0, 0.8);
    }

    @media (max-width: 600px) {
        width: 40px;
        height: 40px;
        font-size: 1.8em;
    }
`;

const ProductName = styled.h1`
    font-size: 2em;
    font-weight: 700;
    margin: 0 0 10px 0;
    line-height: 1.3;
`;

const ProductPrice = styled.p`
    font-size: 2.5em;
    font-weight: 800;
    color: ${colors.BLUE_100};
    margin: 0 0 30px 0;
`;

const ProductMeta = styled.div`
    border-top: 1px solid ${colors.GRAY_75};
    border-bottom: 1px solid ${colors.GRAY_75};
    padding: 15px 0;
    margin-bottom: 30px;
`;

const MetaItem = styled.div`
    display: flex;
    margin: 8px 0;
    font-size: 1em;

    label {
        font-weight: 600;
        color: ${colors.GRAY_200};
        width: 100px;
    }
    > span {
        color: ${colors.BLACK_100};
        font-weight: 500;
    }
`;

const HashtagContainer = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

const Hashtag = styled.span`
    display: inline-block;
    padding: 5px 12px;
    background-color: ${colors.BLUE_50};
    border-radius: 20px;
    font-size: 0.9em;
    font-weight: 500;
    color: ${colors.GRAY_200};
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const DescriptionSection = styled.div`
    padding: 30px 0;
    border-top: 1px solid ${colors.GRAY_75};

    h2 {
        font-size: 1.5em;
        font-weight: 700;
        margin-bottom: 20px;
    }
`;

const DescriptionContent = styled.div`
    white-space: pre-wrap;
    line-height: 1.6;
    color: ${colors.BLACK_100};
    padding: 15px;
    border: 1px solid ${colors.GRAY_50};
    border-radius: 4px;
    background-color: ${colors.WHITE_100};
`;

const MessageBox = styled.div<{ isError?: boolean }>`
    text-align: center;
    padding: 40px;
    font-size: 1.2em;
    color: ${(props) => (props.isError ? colors.RED : colors.GRAY_200)};
    background-color: ${(props) => (props.isError ? "#fdd" : colors.GRAY_50)};
    border: 1px solid ${(props) => (props.isError ? colors.RED : colors.GRAY_75)};
    border-radius: 8px;
    margin-top: 50px;
`;

const SoldOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
`;

const SoldText = styled.span`
    color: white;
    font-size: 2rem;
    font-weight: 800;
    border: 3px solid white;
    padding: 10px 20px;
    border-radius: 8px;
    transform: rotate(-15deg);
`;

export default ProductDetailPage;
