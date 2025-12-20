import { searchProduct } from "@/api/products";
import { colors } from "@/constants";
import { Product } from "@/types/types";
import { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Pagination from "@/components/Common/Pagination";

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const pageParam = searchParams.get("page");
    const currentPage = pageParam ? parseInt(pageParam) : 1;

    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const SearchResults = async () => {
            if (!query.trim()) {
                setProducts([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const data = await searchProduct(query, currentPage, 6);
                setProducts(data.products);
                setTotalPages(data.totalPages);
                setTotalCount(data.totalCount);
            } catch (error) {
                console.error(error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        SearchResults();
    }, [query, currentPage]);

    const handlePageChange = (newPage: number) => {
        searchParams.set("page", newPage.toString());
        setSearchParams(searchParams);
        window.scrollTo(0, 0);
    };

    return (
        <Container>
            <HeaderArea>
                <Title>
                    <Highlight>'{query}'</Highlight> 검색 결과
                </Title>
                <ResultCount>
                    총 <Bold>{totalCount}</Bold>개의 상품
                </ResultCount>
            </HeaderArea>

            {isLoading ? (
                <Loading>상품을 열심히 찾고 있습니다...</Loading>
            ) : products.length > 0 ? (
                <>
                    <GridContainer>
                        {products.map((product) => (
                            <ProductCard key={product._id} onClick={() => navigate(`/products/${product._id}`)}>
                                <ProductThumbnail>
                                    {product.images?.[0] ? (
                                        <ProductImage
                                            src={`http://localhost:5000${product.images[0]}`}
                                            alt={product.name}
                                        />
                                    ) : (
                                        <NoImagePlaceholder>No Image</NoImagePlaceholder>
                                    )}
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
                    </GridContainer>

                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
            ) : (
                <EmptyState>
                    <FiAlertCircle size={50} color={colors.GRAY_100} />
                    <EmptyText>검색 결과가 없습니다.</EmptyText>
                </EmptyState>
            )}
        </Container>
    );
};

const Container = styled.div`
    max-width: 1200px;
    min-height: 80vh;
    margin: 0 auto;
    padding: 80px 20px;
`;

const HeaderArea = styled.div`
    margin-bottom: 30px;
    border-bottom: 1px solid ${colors.GRAY_50};
    padding-bottom: 20px;
`;

const Title = styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 10px;
`;

const Highlight = styled.span`
    color: ${colors.GREEN_100};
`;

const ResultCount = styled.p`
    font-size: 0.95rem;
    color: ${colors.GRAY_100};
`;

const Bold = styled.span`
    font-weight: 700;
    font-size: 14px;
`;

const Loading = styled.div`
    text-align: center;
    padding: 100px 0;
    font-size: 1.1rem;
    color: ${colors.GRAY_100};
`;

const GridContainer = styled.div`
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

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 0;
    gap: 15px;
`;

const EmptyText = styled.p`
    font-size: 1.2rem;
    font-weight: 600;
    color: #555;
`;

export default SearchPage;
