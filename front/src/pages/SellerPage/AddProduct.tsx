import CustomButton from "@/components/Common/CustomButton";
import CustomInput from "@/components/Common/CustomInput";
import { colors } from "@/constants";
import { Product } from "@/types/types";
import { ProductSchema } from "@/utils/validation/productSchemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";

const MAX_IMAGES = 5;

const AddProduct = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Product>({ resolver: yupResolver(ProductSchema) });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [ImageFiles, setImageFiles] = useState<File[]>([]);
    const [previewImage, setPreviewImage] = useState<string[]>([]);
    const [imageUploadError, setImageUploadError] = useState<string | null>(null);

    const handleRegister: SubmitHandler<Product> = (data) => {
        console.log(data);
    };

    const categories = [
        { id: "", name: "카테고리 선택" },
        { id: "electronics", name: "전자제품" },
        { id: "books", name: "도서" },
        { id: "food", name: "식품" },
        { id: "misc", name: "기타" },
        { id: "uncategorized", name: "분류 없음" },
    ];

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files) {
            const newFiles = Array.from(event.dataTransfer.files);
            const totalFiles = setImageFiles.length + newFiles.length;
        }
    };

    return (
        <ProductContainer>
            <Title>상품 등록 페이지</Title>
            <Form onSubmit={handleSubmit(handleRegister)}>
                <FormGroup>
                    <Label>상품명(필수)</Label>
                    <CustomInput {...register("name")} inputSize="large" error={errors.name?.message} />
                </FormGroup>

                <FormGroup>
                    <Label>판매가격(필수)</Label>
                    <CustomInput
                        {...register("price", { valueAsNumber: true })}
                        type="number"
                        inputSize="large"
                        error={errors.price?.message}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>카테고리(필수)</Label>
                    <StyledSelect {...register("categoryId")} error={!!errors.categoryId}>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </StyledSelect>
                    {errors.categoryId && <ErrorMessage>{errors.categoryId.message}</ErrorMessage>}
                    <br />
                </FormGroup>

                <FormGroup>
                    <Label>상품 이미지 업로드(최대 {MAX_IMAGES}개)</Label>
                    <ImageUploaderContainer
                        onClick={ImageFiles.length < MAX_IMAGES ? handleFileSelect : undefined}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    ></ImageUploaderContainer>
                </FormGroup>

                <br />
                <CustomButton type="submit">상품 등록</CustomButton>
            </Form>
        </ProductContainer>
    );
};

const ProductContainer = styled.div`
    padding: 40px;
    max-width: 800px;
    margin: 0 auto;
`;

const Title = styled.h1`
    margin-top: 2%;
    font-size: 32px;
    text-align: center;
    margin-bottom: 5%;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    padding-left: 10px;
    font-size: 16px;
    margin-bottom: 8px;
    font-weight: 500;
`;

const StyledSelect = styled.select<{ error?: boolean }>`
    padding: 10px 15px;
    border: 1px solid ${(props) => (props.error ? colors.RED : colors.GRAY_25)};
    border-radius: 4px;
    font-size: 16px;
    height: 40px;
    width: 100%;
    &:focus {
        border-color: ${colors.BLUE_50};
        outline: none;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
`;

const ErrorMessage = styled.p`
    color: ${colors.RED};
    font-size: 14px;
    margin-top: 5px;
`;

const ImageUploaderContainer = styled.div<{ error?: boolean; isFull?: boolean }>`
    border: 2px dashed ${(props) => (props.error ? colors.RED : props.isFull ? colors.GRAY_100 : colors.GRAY_25)};
    border-radius: 8px;
    padding: 30px;
    text-align: center;
    cursor: ${(props) => (props.isFull ? "not-allowed" : "pointer")};
    background-color: ${(props) => (props.isFull ? colors.GRAY_200 : colors.WHITE_100)};
    transition: all 0.3s ease;
    width: 100%;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &:hover {
        border-color: ${(props) => (props.isFull ? colors.GRAY_200 : colors.GREEN_100)};
    }

    p {
        color: ${(props) => (props.isFull ? "#999" : "#666")};
        margin-bottom: 10px;
    }
`;

export default AddProduct;
