import { getWishlist } from "@/api/wishlist";
import CustomButton from "@/components/Common/CustomButton";
import { colors, SERVER_URL } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { Product } from "@/types/types";
import { useEffect, useState } from "react";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

const WishlistPage = () => {
    const navigate = useNavigate();
    const { isAuth } = useAuthStore();

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!isAuth) {
                toast.warning("로그인이 필요합니다.");
                navigate("/login");
                return;
            }

            try {
                const data = await getWishlist();
                setProducts(data.wishlist || []);
            } catch (error) {
                console.error("찜 목록 로딩 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWishlist();
    }, [isAuth, navigate]);

    const handleProductClick = (productId: string) => {
        navigate(`/products/${productId}`);
    };

    if (isLoading) return <LoadingState>관심 상품을 불러오고 있습니다...</LoadingState>;

    return (
        <Container>
            <HeaderArea>
                <Title>
                    관심 상품 <HeartIcon />
                </Title>
                <Subtitle>내가 찜한 상품을 모아보세요.</Subtitle>
            </HeaderArea>

            {products.length > 0 ? (
                <>
                    <CountText>
                        총 <b>{products.length}</b>개의 상품이 있습니다.
                    </CountText>
                    <GridContainer>
                        {products.map((product) => (
                            <ProductCard key={product._id} onClick={() => handleProductClick(product._id)}>
                                <ImageWrapper>
                                    {product.images?.[0] ? (
                                        <ProductImage src={`${SERVER_URL}${product.images?.[0]}`} alt={product.name} />
                                    ) : (
                                        <NoImagePlaceholder>No Image</NoImagePlaceholder>
                                    )}
                                </ImageWrapper>

                                <InfoWrapper>
                                    <ProductTitle>{product.name}</ProductTitle>
                                    <Price>{product.price.toLocaleString()}원</Price>
                                    <MetaInfo>
                                        <span>{product.region}</span>
                                        <Divider>·</Divider>
                                        <span>{product.sellerName}</span>
                                    </MetaInfo>
                                </InfoWrapper>
                            </ProductCard>
                        ))}
                    </GridContainer>
                </>
            ) : (
                <EmptyState>
                    <EmptyIconWrapper>
                        <FiShoppingCart size={40} color="#ccc" />
                    </EmptyIconWrapper>
                    <EmptyTitle>찜한 상품이 없습니다.</EmptyTitle>
                    <EmptyDesc>마음에 드는 상품을 찾아 관심상품 등록 버튼을 눌러보세요!</EmptyDesc>
                    <ButtonWrapper>
                        <CustomButton variant="green" size="medium" onClick={() => navigate("/")}>
                            상품 구경하러 가기
                        </CustomButton>
                    </ButtonWrapper>
                </EmptyState>
            )}
        </Container>
    );
};

const LoadingState = styled.div`
    height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: ${colors.GRAY_100};
`;

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 20px;
    min-height: 70vh;
`;
const HeaderArea = styled.div`
    text-align: center;
    margin-bottom: 50px;
`;
const Title = styled.h2`
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #333;
`;
const HeartIcon = styled(FiHeart)`
    color: ${colors.RED};
    fill: ${colors.RED};
`;
const Subtitle = styled.p`
    color: ${colors.GRAY_100};
    font-size: 1rem;
`;

const CountText = styled.div`
    margin-bottom: 20px;
    font-size: 0.95rem;
    color: #555;

    b {
        color: ${colors.GREEN_100};
    }
`;
const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 30px;
`;
const ProductCard = styled.div`
    background-color: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition:
        transform 0.2s,
        box-shadow 0.2s;
    cursor: pointer;
    border: 1px solid #f0f0f0;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
`;

const ImageWrapper = styled.div`
    width: 100%;
    aspect-ratio: 1 / 1;
    position: relative;
    background-color: #f8f8f8;
`;

const ProductImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const InfoWrapper = styled.div`
    padding: 18px;
`;

const ProductTitle = styled.h3`
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 10px;
    line-height: 1.4;
    height: 2.8em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #333;
`;

const Price = styled.p`
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 12px;
    color: #222;
`;

const MetaInfo = styled.div`
    font-size: 0.85rem;
    color: #888;
    display: flex;
    align-items: center;
`;

const Divider = styled.span`
    margin: 0 6px;
    font-size: 0.7rem;
    color: #ddd;
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 0;
    text-align: center;
`;

const EmptyIconWrapper = styled.div`
    width: 80px;
    height: 80px;
    background-color: ${colors.WHITE_100};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
`;

const EmptyTitle = styled.h3`
    font-size: 1.5rem;
    font-weight: 600;
    color: ${colors.BLACK_100};
    margin-bottom: 10px;
`;

const EmptyDesc = styled.p`
    color: ${colors.GRAY_200};
    margin-bottom: 30px;
`;

const ButtonWrapper = styled.div`
    width: 200px;
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

export default WishlistPage;
