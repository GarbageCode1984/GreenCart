import * as yup from "yup";

export const ProductSchema = yup.object().shape({
    name: yup
        .string()
        .required("상품명을 입력해주세요.")
        .min(2, "상품명은 2자 이상이어야 합니다.")
        .max(30, "상품명은 30자를 초과할 수 없습니다."),

    price: yup
        .number()
        .transform((value) => (Number.isNaN(value) || value === null || value === "" ? undefined : value))
        .required("판매가를 입력해주세요.")
        .positive("판매가는 양수여야 합니다.")
        .integer("판매가는 정수여야 합니다.")
        .min(100, "판매가는 100원 이상이어야 합니다."),

    categoryId: yup.string().required("카테고리를 선택해주세요."),
    description: yup.string().nullable().max(500, "설명은 500자를 초과할 수 없습니다."),
    images: yup.array(yup.mixed<File>()).nullable().optional().max(5, "이미지는 최대 5개까지 업로드할 수 있습니다."),
});
