import CustomButton from "@/components/Common/CustomButton";
import CustomInput from "@/components/Common/CustomInput";
import { colors } from "@/constants";
import { Product } from "@/types/types";
import { ProductSchema } from "@/utils/validation/productSchemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import { FileRejection, useDropzone } from "react-dropzone";
import CustomTextarea from "@/components/Common/CustomTextarea";

const MAX_IMAGES = 5;

const AddProduct = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Product>({ resolver: yupResolver(ProductSchema) });

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imageUploadError, setImageUploadError] = useState<string | null>(null);

    const previewImageUrls = imageFiles.map((file) => URL.createObjectURL(file));

    useEffect(() => {
        const urlsToRevoke = previewImageUrls;

        setValue("images", imageFiles.length > 0 ? imageFiles : null, {
            shouldValidate: true,
            shouldDirty: true,
        });

        return () => {
            urlsToRevoke.forEach((url: string) => URL.revokeObjectURL(url));
        };
    }, [imageFiles, setValue]);

    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            setImageUploadError(null);

            if (imageFiles.length + acceptedFiles.length > MAX_IMAGES) {
                setImageUploadError(`이미지는 최대 ${MAX_IMAGES}개까지만 업로드할 수 있습니다.`);
                return;
            }

            if (fileRejections.length > 0) {
                const rejectedTypes = fileRejections.map((rejection) => rejection.file.type || "알 수 없음");
                setImageUploadError(`다음 파일 타입은 허용되지 않습니다: ${rejectedTypes.join(", ")}`);
                return;
            }

            const newValidFiles = acceptedFiles.filter(
                (file) =>
                    !imageFiles.some(
                        (existingFile) => existingFile.name === file.name && existingFile.size === file.size
                    )
            );

            if (newValidFiles.length === 0 && acceptedFiles.length > 0) {
                setImageUploadError("이미 존재하는 파일이거나 유효하지 않은 파일입니다.");
                return;
            }

            setImageFiles((prevFiles) => {
                const combinedFiles = [...prevFiles, ...newValidFiles];
                return combinedFiles.slice(0, MAX_IMAGES);
            });
        },
        [imageFiles]
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
        },
        noClick: true,
        noKeyboard: true,
        noDrag: true,
        maxFiles: MAX_IMAGES - imageFiles.length,
    });

    const handleImageRemove = (indexToRemove: number) => {
        setImageFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
        setImageUploadError(null);
    };

    const handleAddProduct: SubmitHandler<Product> = (data) => {
        console.log(data);
    };

    const categories = [
        { id: "", name: "카테고리 선택" },
        { id: "electronics", name: "전자제품" },
        { id: "books", name: "도서" },
        { id: "food", name: "식품" },
        { id: "uncategorized", name: "분류 없음" },
    ];

    const ImageUploadCount = imageFiles.length >= MAX_IMAGES;

    return (
        <ProductContainer>
            <Title>상품 등록 페이지</Title>
            <FormGroup onSubmit={handleSubmit(handleAddProduct)}>
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
                    <Label>상품 설명 (선택 사항)</Label>
                    <CustomTextarea
                        {...register("description")}
                        placeholder="상품에 대한 상세 설명을 입력해주세요."
                        rows={6}
                    />
                    <br />
                </FormGroup>

                <FormGroup>
                    <Label>상품 이미지 (선택 사항, 최대 {MAX_IMAGES}개)</Label>
                    <ImageUploaderContainer
                        {...getRootProps()}
                        onClick={imageFiles.length < MAX_IMAGES ? open : undefined}
                        error={!!errors.images || !!imageUploadError}
                        isDragActive={isDragActive}
                        isFull={imageFiles.length >= MAX_IMAGES}
                    >
                        <input {...getInputProps()} />
                        {ImageUploadCount ? (
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
                                    <RemoveButton onClick={() => handleImageRemove(index)}>X</RemoveButton>
                                </ImageWrapper>
                            ))}
                        </ImagePreviewContainer>
                    )}
                </FormGroup>

                <br />
                <CustomButton type="submit">상품 등록</CustomButton>
            </FormGroup>
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
        border-color: ${colors.GREEN_100};
        outline: none;
        box-shadow: 0 0 0 0.02rem rgba(67, 255, 117, 0.695);
    }
`;

const ErrorMessage = styled.p`
    color: ${colors.RED};
    font-size: 14px;
    margin-top: 5px;
`;

const ImageUploaderContainer = styled.div<{ error?: boolean; isFull?: boolean; isDragActive?: boolean }>`
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
        border-color: ${(props) => (props.isFull ? colors.GRAY_100 : colors.GREEN_100)};
    }

    p {
        color: ${(props) => (props.isFull ? colors.WHITE_100 : colors.GRAY_200)};
        margin-bottom: 10px;
    }
`;

const ImagePreviewContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
    width: 100%;
    justify-content: flex-start;
`;

const ImageWrapper = styled.div`
    position: relative;
    width: 100px;
    height: 100px;
    border: 1px solid #ddd;
    border-radius: 4px;
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
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
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
