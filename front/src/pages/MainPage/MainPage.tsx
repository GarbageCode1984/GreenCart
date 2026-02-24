import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { colors } from "@/constants";
import { getAllProducts } from "@/api/products";
import CustomButton from "@/components/Common/CustomButton";
import { Product } from "@/types/types";
import { SERVER_URL } from "@/constants";

const CATEGORIES = [
    { name: "디지털 기기", icon: "📱", keyword: "디지털" },
    { name: "의류/잡화", icon: "👕", keyword: "의류" },
    { name: "가구/인테리어", icon: "🛋️", keyword: "가구" },
    { name: "도서/티켓", icon: "📚", keyword: "도서" },
    { name: "기타/잡화", icon: "🎸", keyword: "기타" },
    { name: "무료나눔", icon: "🎁", keyword: "무료나눔" },
];

const MainPage = () => {
    const navigate = useNavigate();
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecentProducts = async () => {
            try {
                setIsLoading(true);
                const data = await getAllProducts(1, 8);
                setRecentProducts(data.products);
            } catch (error) {
                console.error("상품 로딩 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecentProducts();
    }, []);

    return (
        <Container>
            <BannerSection>
                <BannerTextContainer>
                    <BannerBadge>GreenCart 중고마켓</BannerBadge>
                    <BannerTitle>
                        우리 동네에서 찾는
                        <br />
                        놀라운 <span>중고거래</span>
                    </BannerTitle>
                    <BannerSub>
                        안 쓰는 물건을 팔아 수익을 내고,
                        <br />
                        필요한 물건을 저렴하게 득템하세요!
                    </BannerSub>
                    <ButtonWrapper>
                        <CustomButton onClick={() => navigate("/seller/add-product")}>내 물건 판매하기</CustomButton>
                    </ButtonWrapper>
                </BannerTextContainer>
                <BannerImageContainer>
                    <CircleDecoration $size="250px" $top="-30px" $right="-20px" $color="rgba(255,255,255,0.4)" />
                    <CircleDecoration $size="150px" $bottom="-10px" $left="20px" $color="rgba(255,255,255,0.3)" />
                    <BannerEmoji>🛍️</BannerEmoji>
                </BannerImageContainer>
            </BannerSection>

            <Section>
                <SectionTitle>어떤 물건을 찾으시나요?</SectionTitle>
                <CategoryGrid>
                    {CATEGORIES.map((cat, index) => (
                        <CategoryCard key={index} onClick={() => navigate(`/search?q=${cat.keyword}`)}>
                            <CategoryIcon>{cat.icon}</CategoryIcon>
                            <CategoryName>{cat.name}</CategoryName>
                        </CategoryCard>
                    ))}
                </CategoryGrid>
            </Section>

            <Section>
                <SectionHeader>
                    <SectionTitle>✨ 방금 올라온 따끈따끈한 매물</SectionTitle>
                    <ViewAllButton onClick={() => navigate("/products")}>전체보기 &gt;</ViewAllButton>
                </SectionHeader>

                {isLoading ? (
                    <LoadingText>상품을 불러오는 중입니다...</LoadingText>
                ) : (
                    <ProductGrid>
                        {recentProducts.map((product) => (
                            <ProductCard key={product._id} onClick={() => navigate(`/products/${product._id}`)}>
                                <ProductThumbnail>
                                    {product.images?.[0] ? (
                                        <ProductImage
                                            src={`${SERVER_URL}${product.images[0]}`}
                                            alt={product.name}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <NoImagePlaceholder>No Image</NoImagePlaceholder>
                                    )}
                                    {product.status === "SOLD_OUT" && <SoldOutOverlay>판매완료</SoldOutOverlay>}
                                </ProductThumbnail>

                                <InfoWrapper>
                                    <ProductTitle>{product.name}</ProductTitle>
                                    <Price>{product.price.toLocaleString()}원</Price>
                                    <MetaInfo>
                                        <span>{product.region}</span>
                                        <span>·</span>
                                        <span>{product.sellerName}</span>
                                    </MetaInfo>
                                </InfoWrapper>
                            </ProductCard>
                        ))}
                    </ProductGrid>
                )}
            </Section>
        </Container>
    );
};

export default MainPage;

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px 80px;
`;

const BannerSection = styled.div`
    background: linear-gradient(135deg, ${colors?.GREEN_100 || "#2E7D32"} 0%, #81c784 100%);
    border-radius: 20px;
    margin-top: 40px;
    padding: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(46, 125, 50, 0.15);

    @media (max-width: 768px) {
        flex-direction: column;
        padding: 40px 30px;
        text-align: center;
    }
`;

const BannerTextContainer = styled.div`
    position: relative;
    z-index: 2;
    color: white;
`;

const BannerBadge = styled.span`
    display: inline-block;
    background-color: rgba(255, 255, 255, 0.2);
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 15px;
    backdrop-filter: blur(5px);
`;

const BannerTitle = styled.h1`
    font-size: 2.8rem;
    font-weight: 800;
    line-height: 1.3;
    margin-bottom: 15px;

    span {
        color: #ffeb3b;
    }

    @media (max-width: 768px) {
        font-size: 2.2rem;
    }
`;

const BannerSub = styled.p`
    font-size: 1.1rem;
    opacity: 0.9;
    line-height: 1.5;
    margin-bottom: 30px;

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

const ButtonWrapper = styled.div`
    width: 200px;

    @media (max-width: 768px) {
        margin: 0 auto;
    }
`;

const BannerImageContainer = styled.div`
    position: relative;
    width: 300px;
    height: 300px;

    @media (max-width: 768px) {
        display: none;
    }
`;

const CircleDecoration = styled.div<{
    $size: string;
    $top?: string;
    $bottom?: string;
    $left?: string;
    $right?: string;
    $color: string;
}>`
    position: absolute;
    width: ${(props) => props.$size};
    height: ${(props) => props.$size};
    background-color: ${(props) => props.$color};
    border-radius: 50%;
    top: ${(props) => props.$top || "auto"};
    bottom: ${(props) => props.$bottom || "auto"};
    left: ${(props) => props.$left || "auto"};
    right: ${(props) => props.$right || "auto"};
    z-index: 1;
`;

const BannerEmoji = styled.div`
    position: absolute;
    font-size: 8rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2));
`;

const Section = styled.section`
    margin-top: 80px;
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 25px;
`;

const SectionTitle = styled.h2`
    font-size: 1.6rem;
    font-weight: 700;
    color: #333;

    @media (max-width: 768px) {
        font-size: 1.4rem;
        margin-bottom: 20px;
    }
`;

const ViewAllButton = styled.button`
    background: none;
    border: none;
    color: ${colors?.GREEN_100 || "#2E7D32"};
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

const CategoryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 15px;
    margin-top: 30px;

    @media (max-width: 900px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 480px) {
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }
`;

const CategoryCard = styled.div`
    background-color: white;
    border: 1px solid #eee;
    border-radius: 16px;
    padding: 25px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);

    &:hover {
        transform: translateY(-5px);
        border-color: ${colors?.GREEN_100 || "#2E7D32"};
        box-shadow: 0 8px 15px rgba(46, 125, 50, 0.1);
    }
`;

const CategoryIcon = styled.div`
    font-size: 2.5rem;
    margin-bottom: 12px;
`;

const CategoryName = styled.span`
    font-size: 0.95rem;
    font-weight: 600;
    color: #555;
`;

const LoadingText = styled.div`
    text-align: center;
    padding: 100px 0;
    font-size: 1.1rem;
    color: #888;
`;

const ProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 25px;
`;

const ProductCard = styled.div`
    border: 1px solid ${colors?.GRAY_75 || "#eee"};
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition:
        transform 0.2s ease-in-out,
        box-shadow 0.2s;
    background-color: white;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
    }
`;

const ProductThumbnail = styled.div`
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    background-color: #f9f9f9;
    position: relative;
`;

const ProductImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const NoImagePlaceholder = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
    font-size: 1rem;
    font-weight: bold;
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
    font-size: 1.2rem;
    z-index: 10;
`;

const InfoWrapper = styled.div`
    padding: 16px;
`;

const ProductTitle = styled.h3`
    font-size: 1.05rem;
    font-weight: 500;
    margin-bottom: 8px;
    line-height: 1.4;
    height: 2.8em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

const Price = styled.p`
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 10px;
    color: #222;
`;

const MetaInfo = styled.div`
    font-size: 0.8rem;
    color: #888;
    display: flex;
    gap: 6px;
    align-items: center;
`;
