import { getProductById } from "@/api/products";
import { colors } from "@/constants";
import { Product } from "@/types/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

const ProductDetailPage = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
                toast.error(`상품 상세 정보 로드 실패: ${error}`);
            } finally {
                setLoading(false);
            }
        };

        getProduct();
    }, [productId]);

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
    const handleAddToCart = () => {
        toast.success(`${product.name} 상품이 장바구니에 담겼습니다!`);
    };
    const handlePurchase = () => {
        toast.info(`${product.name} 상품 구매 페이지로 이동합니다.`);
        navigate("/checkout", { state: { productId: product._id, price: product.price } });
    };

    return (
        <DetailContainer>
            <DetailWrapper>
                <ImageSection>
                    <ImageCarousel>
                        {product.images && product.images.length > 0 ? (
                            <ProductImage
                                src={`http://localhost:5000${product.images[currentImageIndex]}`}
                                alt={product.name}
                            />
                        ) : (
                            <NoImagePlaceholder>No Image</NoImagePlaceholder>
                        )}
                    </ImageCarousel>

                    {product.images && product.images.length > 1 && (
                        <ThumbnailList>
                            {product.images.map((image, index) => (
                                <ThumbnailItem
                                    key={index}
                                    src={`http://localhost:5000${image}`}
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
                            <label>카테고리 ID:</label>
                            <span>{product.categoryId}</span>
                        </MetaItem>
                        {product !== undefined && (
                            <MetaItem>
                                <label>재고:</label>
                                <span>{product.toLocaleString()}개</span>
                            </MetaItem>
                        )}
                        <MetaItem>
                            <label>등록일:</label>
                            <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                        </MetaItem>
                    </ProductMeta>

                    <ButtonContainer>
                        <ActionButton primary onClick={handlePurchase}>
                            바로 구매하기
                        </ActionButton>
                        <ActionButton onClick={handleAddToCart}>장바구니 담기</ActionButton>
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

const PRIMARY_COLOR = colors.BLUE_200;

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
    border: 2px solid ${(props) => (props.isActive ? PRIMARY_COLOR : "transparent")};
    opacity: ${(props) => (props.isActive ? 1 : 0.7)};
    transition: all 0.2s;

    &:hover {
        opacity: 1;
    }
`;

const InfoSection = styled.div`
    flex: 1;
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
    color: ${PRIMARY_COLOR};
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
    margin-bottom: 8px;
    font-size: 1em;

    label {
        font-weight: 600;
        color: ${colors.GRAY_200};
        width: 100px;
        flex-shrink: 0;
    }
    span {
        color: ${colors.BLACK_100};
        font-weight: 500;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const ActionButton = styled.button<{ primary?: boolean }>`
    flex: 1;
    padding: 12px 20px;
    border: 2px solid ${PRIMARY_COLOR};
    border-radius: 6px;
    font-size: 1em;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;

    background-color: ${(props) => (props.primary ? PRIMARY_COLOR : colors.WHITE)};
    color: ${(props) => (props.primary ? colors.WHITE : PRIMARY_COLOR)};

    &:hover {
        opacity: 0.9;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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
    color: ${colors.GRAY_200};
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

export default ProductDetailPage;
