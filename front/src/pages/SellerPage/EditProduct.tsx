import CustomButton from "@/components/Common/CustomButton";
import CustomInput from "@/components/Common/CustomInput";
import CustomTextarea from "@/components/Common/CustomTextarea";
import { API_BASE_URL, colors } from "@/constants";
import { Product } from "@/types/types";
import { ProductSchema } from "@/utils/validation/productSchemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { Resolver, SubmitHandler, useForm, useWatch } from "react-hook-form";
import styled from "styled-components";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useNavigate } from "react-router-dom";
import { updateProduct } from "@/api/products";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import regionsData from "@/constants/regionsData";

const MAX_IMAGES = 5;

const EditProduct = () => {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        formState: { errors },
    } = useForm<Product>({
        resolver: yupResolver(ProductSchema) as unknown as Resolver<Product>,
        defaultValues: {
            name: "",
            price: 0,
            province: "",
            city: "",
            region: "",
            description: "",
            hashtag: "",
            images: [],
        },
        mode: "onSubmit",
    });

    const navigate = useNavigate();
    const location = useLocation();
    const { productId } = useParams<{ productId: string | undefined }>();

    const productToEdit = location.state?.productToEdit as Product | undefined;

    const [existingImages, setExistingImages] = useState<string[]>([]);

    const {
        imageFiles: newImageFiles,
        previewImageUrls: newImagePreviewUrls,
        imageUploadError,
        getRootProps,
        getInputProps,
        isDragActive,
        openImagePicker,
        handleRemoveImage,
    } = useImageUpload({ maxImages: MAX_IMAGES });

    const provinces = Object.keys(regionsData);

    const watchedFiles = useWatch({ control, name: ["province", "city"] });
    const selectedProvince = watchedFiles[0];
    const selectedCity = watchedFiles[1];

    const cities = selectedProvince ? regionsData[selectedProvince] : [];

    useEffect(() => {
        let regionValue = "";

        if (selectedProvince && selectedCity) {
            regionValue = `${selectedProvince} ${selectedCity}`;
        }

        const shouldValidate = !!(selectedProvince || selectedCity);
        setValue("region", regionValue, { shouldValidate });
    }, [selectedProvince, selectedCity, setValue]);

    const totalImageCount = existingImages.length + newImageFiles.length;
    const isImageLimit = totalImageCount >= MAX_IMAGES;

    useEffect(() => {
        const loadProductData = async () => {
            let productData: Product | null = null;

            if (!productId) {
                toast.error("유효하지 않은 상품 ID입니다.");
                navigate("/");
                return;
            }

            if (productToEdit && productToEdit._id === productId) {
                productData = productToEdit;
            }

            if (productData) {
                let defaultProvince = "";
                let defaultCity = "";

                if (productData.region) {
                    const parts = productData.region.split(" ").filter((part) => part.trim() !== "");

                    if (parts.length >= 1) {
                        defaultProvince = parts[0];
                        defaultCity = parts.slice(1).join(" ");
                    }
                }

                reset({
                    name: productData.name,
                    price: productData.price,
                    description: productData.description,
                    hashtag: productData.hashtag,
                    province: defaultProvince,
                    city: defaultCity,
                    region: productData.region,
                    images: [],
                });

                if (defaultCity) {
                    setTimeout(() => {
                        setValue("city", defaultCity);
                    }, 10);
                }

                setExistingImages((productData.images as unknown as string[]) || []);
            }
        };

        loadProductData();
    }, [productId, productToEdit, reset, navigate, setValue]);

    useEffect(() => {
        setValue("images", newImageFiles.length > 0 ? newImageFiles : [], {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, [newImageFiles, setValue]);

    const handleRemoveExistingImage = useCallback((urlToRemove: string) => {
        setExistingImages((prev) => prev.filter((url) => url !== urlToRemove));
    }, []);

    const handleEditProduct: SubmitHandler<Product> = async (data: Product) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("price", data.price.toString());
        formData.append("region", data.region);
        formData.append("description", data.description || "");
        formData.append("hashtag", data.hashtag || "");

        newImageFiles.forEach((file) => {
            formData.append("newImages", file);
        });

        formData.append("existingImages", JSON.stringify(existingImages));

        try {
            const productUpdateId = productId ?? "";
            await updateProduct(productUpdateId, formData);
            toast.success("상품이 성공적으로 수정되었습니다!");
            navigate(`/products/${productId}`);
        } catch (error) {
            console.log("상품 수정 실패");
            alert(`상품 수정에 실패했습니다: ${error.message}`);
        }
    };

    return (
        <ProductContainer>
            <Title>상품 수정 페이지</Title>
            <Form onSubmit={handleSubmit(handleEditProduct)}>
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
                    <Label>거래 지역 (필수)</Label>
                    <AddressSelectContainer>
                        <Select
                            {...register("province", {
                                onChange: () => {
                                    setValue("city", "");
                                },
                            })}
                            error={!!errors.region}
                            aria-invalid={!!errors.region}
                            aria-label="시/도 선택"
                        >
                            <option value="">시/도 선택</option>
                            {provinces.map((province) => (
                                <option key={province} value={province}>
                                    {province}
                                </option>
                            ))}
                        </Select>

                        <Select
                            {...register("city")}
                            disabled={!selectedProvince || cities.length === 0}
                            error={!!errors.region}
                            aria-invalid={!!errors.region}
                            aria-label="시/군/구 선택"
                        >
                            <option value="">시/군/구 선택</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </Select>
                    </AddressSelectContainer>
                    {errors.region && (
                        <ErrorMessage style={{ marginTop: "-16px" }}>{errors.region.message}</ErrorMessage>
                    )}
                    <input type="hidden" {...register("region")} />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="hashtag">해시태그(선택 사항, 최대 3개, 각 10자 이내)</Label>
                    <CustomInput
                        id="hashtag"
                        {...register("hashtag")}
                        placeholder="예시) 신발, 한정판, 나이키 (쉼표나 공백으로 구분)"
                        inputSize="large"
                        error={errors.hashtag?.message}
                    />
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

                    {(existingImages.length > 0 || newImagePreviewUrls.length > 0) && (
                        <ImagePreviewContainer>
                            {existingImages.map((url, index) => (
                                <ImageWrapper key={`existing-${index}-${url}`}>
                                    <PreviewImage src={`${API_BASE_URL}${url}`} alt={`기존 이미지 ${index + 1}`} />
                                    <RemoveButton type="button" onClick={() => handleRemoveExistingImage(url)}>
                                        X
                                    </RemoveButton>
                                </ImageWrapper>
                            ))}

                            {newImagePreviewUrls.map((url, index) => (
                                <ImageWrapper key={`new-${index}`}>
                                    <PreviewImage src={url} alt={`새로 추가된 이미지 ${index + 1}`} />
                                    <RemoveButton type="button" onClick={() => handleRemoveImage(index)}>
                                        X
                                    </RemoveButton>
                                </ImageWrapper>
                            ))}
                        </ImagePreviewContainer>
                    )}
                </FormGroup>

                <CustomButton type="submit">상품 수정</CustomButton>
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

const AddressSelectContainer = styled.div`
    display: flex;
    gap: 10px;
    width: 100%;
    margin-bottom: 10px;
    @media (max-width: 600px) {
        flex-direction: column;
    }
`;

const Select = styled.select<{ error?: boolean }>`
    flex: 1;
    padding: 10px 15px;
    font-size: 16px;
    border: 1px solid ${(props) => (props.error ? colors.RED : colors.GRAY_100)};
    border-radius: 8px;
    appearance: none;
    background-color: ${colors.WHITE_100};
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 16px;
    cursor: pointer;
    transition:
        border-color 0.3s ease,
        box-shadow 0.3s ease;

    &:focus {
        outline: none;
        border-color: ${colors.GREEN_50};
        box-shadow: 0 0 0 3px ${colors.GREEN_100};
    }

    &:disabled {
        background-color: ${colors.GRAY_25};
        cursor: not-allowed;
        color: ${colors.GRAY_100};
    }
`;

export default EditProduct;
