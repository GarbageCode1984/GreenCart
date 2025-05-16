import * as yup from "yup";

export const registerSchema = yup.object().shape({
    name: yup
        .string()
        .required("이름을 입력해주세요")
        .min(2, "이름은 2자 이상이어야 합니다.")
        .max(16, "이름은 16자를 초과할 수 없습니다."),

    email: yup
        .string()
        .required("이메일을 입력해주세요.")
        .email("유효한 이메일 형식이 아닙니다.")
        .lowercase()
        .matches(
            /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
            "email 형식에 맞지 않습니다"
        ),

    password: yup
        .string()
        .required("비밀번호를 입력해주세요.")
        .min(8, "비밀번호는 8자 이상이어야 합니다.")
        .max(100, "비밀번호는 100자를 초과할 수 없습니다."),

    confirmPassword: yup
        .string()
        .required("비밀번호 확인을 입력해주세요.")
        .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다."),
});

export const loginSchema = yup.object().shape({
    email: yup
        .string()
        .required("이메일을 입력해주세요.")
        .email("유효한 이메일 형식이 아닙니다.")
        .lowercase()
        .matches(
            /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
            "email 형식에 맞지 않습니다"
        ),

    password: yup
        .string()
        .required("비밀번호를 입력해주세요.")
        .min(8, "비밀번호는 8자 이상이어야 합니다.")
        .max(100, "비밀번호는 100자를 초과할 수 없습니다."),
});
