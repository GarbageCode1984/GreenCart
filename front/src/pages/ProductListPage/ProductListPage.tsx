import { getAllProducts } from "@/api/products";
import { colors } from "@/constants";
import { Product } from "@/types/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const ProductListPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setIsLoading(true);
                const data = await getAllProducts();
                setProducts(data);
                setError(null);
            } catch (error) {
                setError(error.message);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadProducts();
    }, []);

    if (isLoading) {
        return <LoadingMessage>상품 목록을 불러오는 중입니다...</LoadingMessage>;
    }
    if (error) {
        return <ErrorMessage>데이터 로딩 실패: {error} 😥</ErrorMessage>;
    }
    if (products.length === 0) {
        return <NoProductMessage>등록된 상품이 없습니다. 텅 비어있네요! 😿</NoProductMessage>;
    }

    return (
        <PageContainer>
            <h1>🛍️ 전체 상품</h1>
            <p className="product-count">총 {products.length}개의 상품이 있습니다.</p>

            <ProductGrid>
                {products.map((product) => (
                    <ProductCard key={product._id} onClick={() => navigate(`/products/${product._id}`)}>
                        <ProductThumbnail>
                            {product.images?.[0] ? (
                                <ProductImage src={`http://localhost:5000${product.images[0]}`} alt={product.name} />
                            ) : (
                                <NoImagePlaceholder>No Image</NoImagePlaceholder>
                            )}
                        </ProductThumbnail>

                        {/* <ProductInfo>
                            <h3 className="product-name">{product.name}</h3>
                            <ProductPrice>₩{product.price.toLocaleString()}</ProductPrice>
                        </ProductInfo> */}

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
        </PageContainer>
    );
};

const PageContainer = styled.div`
    max-width: 1200px;
    min-height: 80vh;
    margin: 0 auto;
    padding: 80px 20px;

    h1 {
        font-size: 2em;
        margin-bottom: 5px;
    }
    .product-count {
        color: ${colors.GRAY_200};
        margin-bottom: 25px;
    }
`;

const ProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
`;

const ProductCard = styled.div`
    border: 1px solid ${colors.GRAY_75};
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
`;

const ProductThumbnail = styled.div`
    width: 100%;
    height: 250px;
    overflow: hidden;
    flex-shrink: 0;
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
    background-color: ${colors.GRAY_50};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.GRAY_100};
    font-size: 1.2em;
    font-weight: bold;
`;

const InfoWrapper = styled.div`
    padding: 16px;
`;

const ProductTitle = styled.h3`
    font-size: 1rem;
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
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 10px;
    color: ${colors.BLUE_200};
`;

const MetaInfo = styled.div`
    font-size: 0.8rem;
    color: ${colors.GRAY_200};
    display: flex;
    gap: 6px;
    align-items: center;
`;

const LoadingMessage = styled.div`
    text-align: center;
    padding: 50px;
    font-size: 1.2em;
    color: ${colors.BLACK_100};
`;

const ErrorMessage = styled.div`
    color: ${colors.RED};
    text-align: center;
    padding: 20px;
    border: 1px solid ${colors.RED};
    background-color: ${colors.GRAY_50};
    margin: 50px auto;
    max-width: 400px;
    border-radius: 8px;
`;

const NoProductMessage = styled.div`
    text-align: center;
    padding: 50px;
    color: ${colors.GRAY_100};
    font-size: 1.1em;
`;

export default ProductListPage;
