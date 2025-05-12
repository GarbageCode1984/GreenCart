import CustomButton from "@/components/Common/CustomButton";
import CustomInput from "@/components/Common/CustomInput";
import axiosInstance from "@/utils/axois";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const RegisterPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>();

    const navigate = useNavigate();

    const handleRegister = async (data: RegisterFormData) => {
        try {
            const response = await axiosInstance.post("/users/register", {
                name: data.name,
                email: data.email,
                password: data.password,
            });

            if (response.status === 201) {
                alert("회원가입 성공!");
                navigate("/login");
            }
        } catch (error: any) {
            console.error("회원가입 에러:", error);

            const serverErrorMessage =
                error.response?.data?.details || error.response?.data?.message || "알 수 없는 오류가 발생했습니다.";

            alert(`회원가입 실패: ${serverErrorMessage}`);
        }
    };

    const userName = {
        required: "이름을 입력해주세요",
        minLength: {
            value: 2,
            message: "이름은 2자 이상이어야 합니다.",
        },
        maxLength: {
            value: 16,
            message: "이름은 16자를 초과할 수 없습니다.",
        },
    };

    const userEmail = {
        required: "이메일을 입력해주세요.",
        pattern: {
            value: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
            message: "유효한 이메일 형식이 아닙니다.",
        },
    };

    const userPassword = {
        required: "비밀번호를 입력해주세요.",
        minLength: {
            value: 8,
            message: "비밀번호는 8자 이상이어야 합니다.",
        },
        maxLength: {
            value: 100,
            message: "비밀번호는 100자를 초과할 수 없습니다.",
        },
    };

    const passwordConfirm = {
        required: "비밀번호 확인을 입력해주세요.",
        validate: (value: string, formValues: RegisterFormData) => {
            return value === formValues.password || "비밀번호가 일치하지 않습니다.";
        },
    };

    return (
        <Container as="form" onSubmit={handleSubmit(handleRegister)}>
            <InputForm>
                <CustomInput
                    type="text"
                    label="이름 입력"
                    {...register("name", userName)}
                    error={errors.name?.message}
                />
                <CustomInput
                    type="email"
                    label="이메일 입력"
                    {...register("email", userEmail)}
                    error={errors.email?.message}
                />
                <CustomInput
                    type="password"
                    label="비밀번호 입력"
                    {...register("password", userPassword)}
                    error={errors.password?.message}
                />
                <CustomInput
                    type="password"
                    label="비밀번호 확인"
                    {...register("confirmPassword", passwordConfirm)}
                    error={errors.confirmPassword?.message}
                />
            </InputForm>
            <CustomButton type="submit">회원가입</CustomButton>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 0 20px;
`;

const InputForm = styled.div`
    margin-bottom: 25px;
`;

export default RegisterPage;
