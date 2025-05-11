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
            const response = await axiosInstance.post("/api/users/register", {
                name: data.name,
                email: data.email,
                password: data.password,
            });

            if (response.status === 201) {
                // 회원가입 성공 메시지 어떻게 할지 고민해보기
                navigate("/login");
            }
        } catch (error) {
            console.error("회원가입 에러:", error);
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

    return (
        <Container as="form" onSubmit={handleSubmit(handleRegister)}>
            <InputForm>
                <CustomInput type="text" label="이름 입력" {...register("name", userName)} />
                <CustomInput
                    type="email"
                    label="이메일 입력"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
                <CustomInput
                    type="password"
                    label="비밀번호 입력"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                <CustomInput
                    type="password"
                    label="비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                />
            </InputForm>
            <CustomButton onClick={handleRegister}>회원가입</CustomButton>
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
