import { colors } from "@/constants";
import styled from "styled-components";

import catAImg1 from "../../assets/categoryA/product_a_1.jpg";
import catAImg2 from "../../assets/categoryA/product_a_2.jpg";
import catAImg3 from "../../assets/categoryA/product_a_3.jpg";
import catAImg4 from "../../assets/categoryA/product_a_4.jpg";
import catAImg5 from "../../assets/categoryA/product_a_5.jpg";

import catBImg1 from "../../assets/categoryB/product_b_1.jpg";
import catBImg2 from "../../assets/categoryB/product_b_2.jpg";

import catCImg1 from "../../assets/categoryC/product_c_1.jpg";
import catCImg2 from "../../assets/categoryC/product_c_2.jpg";

import catDImg1 from "../../assets/categoryD/product_d_1.jpg";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface CategoryProductSectionProps {
    categoryId: string;
    categoryName: string;
}

interface Product {
    id: string;
    name: string;
    imageUrl: string;
    pirce: number;
}

const localProductData: { [key: string]: Product[] } = {
    "category-a": [
        { id: "a-prod-1", name: "인기 상품 1", imageUrl: catAImg1, pirce: 1000 },
        { id: "a-prod-2", name: "인기 상품 2", imageUrl: catAImg2, pirce: 1500 },
        { id: "a-prod-3", name: "인기 상품 3", imageUrl: catAImg3, pirce: 2000 },
        { id: "a-prod-4", name: "인기 상품 4", imageUrl: catAImg4, pirce: 3000 },
        { id: "a-prod-5", name: "인기 상품 5", imageUrl: catAImg5, pirce: 1000 },
    ],
    "category-b": [
        { id: "b-prod-1", name: "최신 스타일 1", imageUrl: catBImg1, pirce: 15000 },
        { id: "b-prod-2", name: "최신 스타일 2", imageUrl: catBImg2, pirce: 11000 },
    ],
    "category-c": [
        { id: "c-prod-1", name: "친환경 제품 1", imageUrl: catCImg1, pirce: 12000 },
        { id: "c-prod-2", name: "친환경 제품 2", imageUrl: catCImg2, pirce: 15000 },
    ],
    "category-d": [{ id: "d-prod-1", name: "MD 추천 1", imageUrl: catDImg1, pirce: 25000 }],
};

function CategoryProductSection({ categoryId, categoryName }: CategoryProductSectionProps) {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const categoryProduct = localProductData[categoryId] || [];
        setProducts(categoryProduct);
    }, [categoryId]);

    if (products.length === 0) {
        return (
            <SectionContainer>
                <SectionTitle>{categoryName}</SectionTitle>
                <NoProducts>{categoryName} 상품 이미지가 없습니다.</NoProducts>
            </SectionContainer>
        );
    }

    return (
        <SectionContainer>
            <SectionTitle>{categoryName}</SectionTitle>
            <ProductGrid>
                {products.map((product) => (
                    <ProductItem key={product.id} to={`/products/${product.id}`}>
                        <ProductImage src={product.imageUrl} alt={product.name} />
                        <ProductName>{product.name}</ProductName>
                        <ProductPrice>{product.pirce.toLocaleString()}원</ProductPrice>
                    </ProductItem>
                ))}
            </ProductGrid>

            <MoreButton to={`/category/${categoryId}`}>{categoryName} 전체 보기</MoreButton>
        </SectionContainer>
    );
}

const SectionContainer = styled.section`
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 20px;
    margin-bottom: 10%;
`;

const SectionTitle = styled.h2`
    font-size: clamp(1.8rem, 3vw, 2rem);
    color: ${colors.GREEN_100};
    margin-bottom: 2%;
    text-align: center;
`;

const ProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 10px;
    justify-content: center;
`;

const ProductItem = styled(Link)`
    display: block;
    width: 100%;
    border: 1px solid ${colors.GRAY_100};
    border-radius: 4px;
    overflow: hidden;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    text-decoration: none;
    background-color: ${colors.WHITE};

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    }
`;

const ProductImage = styled.img`
    display: block;
    width: 100%;
    height: 180px;
    object-fit: cover;
`;

const ProductName = styled.h2`
    font-size: calc(1.2rem + 0.5vw);
    color: ${colors.BLACK_100};
`;

const ProductPrice = styled.div`
    font-size: calc(0.8rem + 0.5vw);
    color: ${colors.BLACK_100};
`;

const NoProducts = styled.div`
    text-align: center;
    padding: 20px;
    font-size: 1.2rem;
    color: ${colors.GRAY_100};
`;

const MoreButton = styled(Link)`
    display: block;
    width: fit-content;
    margin: 30px auto 0 auto;
    padding: 10px 20px;
    background-color: ${colors.WHITE};
    color: ${colors.BLACK_100};
    border: 1px solid ${colors.GREEN_100};
    border-radius: 5px;
    text-decoration: none;
    font-size: calc(0.8rem + 0.5vw);
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        color: ${colors.WHITE};
        background-color: ${colors.GREEN_100};
    }
`;

export default CategoryProductSection;
