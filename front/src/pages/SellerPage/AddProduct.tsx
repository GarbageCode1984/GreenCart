import CustomButton from "@/components/Common/CustomButton";
import CustomInput from "@/components/Common/CustomInput";
import CustomTextarea from "@/components/Common/CustomTextarea";
import { colors } from "@/constants";
import { Product, Category } from "@/types/types";
import { ProductSchema } from "@/utils/validation/productSchemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import { useImageUpload } from "@/hooks/useImageUpload";

const MAX_IMAGES = 5;

const categories: Category[] = [
    { id: "", name: "카테고리 선택" },
    { id: "electronics", name: "전자제품" },
    { id: "books", name: "도서" },
    { id: "food", name: "식품" },
    { id: "uncategorized", name: "분류 없음" },
];

const AddProduct = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Product>({
        resolver: yupResolver(ProductSchema) as unknown as Resolver<Product>,
    });

    const {
        imageFiles,
        previewImageUrls,
        imageUploadError,
        isImageLimit,
        getRootProps,
        getInputProps,
        isDragActive,
        openImagePicker,
        handleRemoveImage,
    } = useImageUpload({ maxImages: MAX_IMAGES });

    useEffect(() => {
        setValue("images", imageFiles.length > 0 ? imageFiles : null, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, [imageFiles, setValue]);

    const handleAddProduct: SubmitHandler<Product> = async (data: Product) => {
        console.log("폼 데이터:", data);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("price", data.price.toString());
        formData.append("categoryId", data.categoryId);
        formData.append("description", data.description || "");

        data.images?.forEach((file) => {
            if (file instanceof File) {
                formData.append("images", file);
            }
        });

        // try catch 만들 차례
    };

    return (
        <ProductContainer>
            <Title>상품 등록 페이지</Title>
            <Form onSubmit={handleSubmit(handleAddProduct)}>
                <FormGroup>
                    <Label htmlFor="name">상품명(필수)</Label>
                    <CustomInput id="name" {...register("name")} inputSize="large" error={errors.name?.message} />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="price">판매가격(필수)</Label>
                    <CustomInput
                        id="price"
                        {...register("price", { valueAsNumber: true })}
                        type="number"
                        inputSize="large"
                        error={errors.price?.message}
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="categoryId">카테고리(필수)</Label>
                    <StyledSelect id="categoryId" {...register("categoryId")} error={!!errors.categoryId}>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </StyledSelect>
                    {errors.categoryId && <ErrorMessage>{errors.categoryId.message}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="description">상품 설명 (선택 사항)</Label>
                    <CustomTextarea
                        id="description"
                        {...register("description")}
                        placeholder="상품에 대한 상세 설명을 입력해주세요."
                        rows={6}
                        error={errors.description?.message}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>상품 이미지 (선택 사항, 최대 {MAX_IMAGES}개)</Label>
                    <ImageUploaderContainer
                        {...getRootProps()}
                        onClick={isImageLimit ? undefined : openImagePicker}
                        error={!!errors.images || !!imageUploadError}
                        isDragActive={isDragActive}
                        isFull={isImageLimit}
                    >
                        <input {...getInputProps()} />
                        {isImageLimit ? (
                            <p>이미지가 최대 개수({MAX_IMAGES}개)에 도달했습니다.</p>
                        ) : isDragActive ? (
                            <p>여기에 이미지를 놓으세요...</p>
                        ) : (
                            <p>파일을 끌어다 놓거나 클릭하여 선택하세요.</p>
                        )}
                        {(errors.images && <ErrorMessage>{errors.images.message}</ErrorMessage>) ||
                            (imageUploadError && <ErrorMessage>{imageUploadError}</ErrorMessage>)}
                    </ImageUploaderContainer>

                    {previewImageUrls.length > 0 && (
                        <ImagePreviewContainer>
                            {previewImageUrls.map((url, index) => (
                                <ImageWrapper key={url}>
                                    <PreviewImage src={url} alt={`상품 이미지 ${index + 1}`} />
                                    <RemoveButton type="button" onClick={() => handleRemoveImage(index)}>
                                        X
                                    </RemoveButton>
                                </ImageWrapper>
                            ))}
                        </ImagePreviewContainer>
                    )}
                </FormGroup>

                <CustomButton type="submit">상품 등록</CustomButton>
            </Form>
        </ProductContainer>
    );
};

const ProductContainer = styled.div`
    padding: 40px;
    max-width: 800px;
    margin: 0 auto;
    background-color: ${colors.WHITE_100};
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 25px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Title = styled.h1`
    margin-top: 2%;
    font-size: 32px;
    text-align: center;
    margin-bottom: 5%;
    color: ${colors.BLACK_100};
    font-weight: 700;
`;

const Label = styled.label`
    padding-left: 10px;
    font-size: 16px;
    margin-bottom: 8px;
    font-weight: 600;
    color: ${colors.BLACK_100};
`;

const StyledSelect = styled.select<{ error?: boolean }>`
    padding: 10px 15px;
    border: 1px solid ${(props) => (props.error ? colors.RED : colors.GRAY_25)};
    border-radius: 4px;
    font-size: 16px;
    height: 40px;
    width: 100%;
    background-color: ${colors.WHITE_100};
    cursor: pointer;
    &:focus {
        border-color: ${colors.GRAY_100};
        outline: none;
        box-shadow: 0 0 0 0.1rem rgba(106, 248, 141, 0.59);
    }
`;

const ErrorMessage = styled.p`
    color: ${colors.RED};
    font-size: 14px;
    margin-top: 5px;
`;

const ImageUploaderContainer = styled.div<{ error?: boolean; isFull?: boolean; isDragActive?: boolean }>`
    border: 2px dashed
        ${(props) =>
            props.error
                ? colors.RED
                : props.isDragActive
                ? colors.BLUE_50
                : props.isFull
                ? colors.GRAY_100
                : colors.GRAY_25};
    border-radius: 8px;
    padding: 30px;
    text-align: center;
    cursor: ${(props) => (props.isFull ? "not-allowed" : "pointer")};
    background-color: ${(props) =>
        props.isFull ? colors.GRAY_200 : props.isDragActive ? colors.GREEN_100 : colors.WHITE_100};
    transition: all 0.3s ease;
    width: 100%;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &:hover {
        border-color: ${(props) => (props.isFull ? colors.GRAY_100 : colors.BLUE_50)};
    }

    p {
        color: ${(props) => (props.isFull ? colors.BLACK : colors.GRAY_200)};
        margin-bottom: 10px;
    }
`;

const ImagePreviewContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
    border: 1px solid ${colors.GRAY_100};
    border-radius: 8px;
    padding: 10px;
`;

const ImageWrapper = styled.div`
    position: relative;
    width: 100px;
    height: 100px;
    border: 1px solid ${colors.GRAY_200};
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const PreviewImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const RemoveButton = styled.button`
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: ${colors.RED};
    color: ${colors.WHITE_100};
    border: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 1;
    }
`;

export default AddProduct;
