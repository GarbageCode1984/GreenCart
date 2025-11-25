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
        .positive("판매 가격은 0보다 커야 합니다.")
        .integer("판매가는 정수여야 합니다.")
        .min(100, "판매가는 100원 이상이어야 합니다."),

    region: yup.string().required("거래 지역을 시/도와 시/군/구 모두 선택해야 합니다."),

    province: yup.string().nullable().optional(),
    city: yup.string().nullable().optional(),

    hashtag: yup
        .string()
        .optional()
        .test("tag-limit", "해시태그는 최대 3개까지 등록 가능합니다.", (value) => {
            if (!value) return true;
            const tags = value.split(/[\s,]+/).filter((tag) => tag.trim() !== "");
            return tags.length <= 3;
        })
        .test("tag-length", "각 해시태그는 10자를 초과할 수 없습니다.", (value) => {
            if (!value) return true;
            const tags = value.split(/[\s,]+/).filter((tag) => tag.trim() !== "");
            return tags.every((tag) => tag.length <= 10);
        }),

    description: yup.string().max(500, "설명은 500자를 초과할 수 없습니다.").notRequired(),
    images: yup
        .array()
        .of(yup.mixed<File>())
        .max(5, "이미지는 최대 5개까지 업로드할 수 있습니다.")
        .notRequired()
        .nullable(),
});
