import { LoginFormData } from "@/types/types";
import { loginSchema } from "@/utils/validation/authSchemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import CustomInput from "@/components/Common/CustomInput";
import CustomButton from "@/components/Common/CustomButton";
import styled from "styled-components";
import { colors } from "@/constants";
import { loginUser } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/useAuthStore";

const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({ resolver: yupResolver(loginSchema) });

    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const handleLogin = async (data: LoginFormData) => {
        try {
            const response = await loginUser(data);
            const { token, user } = response;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            login(user);
            toast.success("로그인 성공!");
            navigate("/");
        } catch (error) {
            console.log(error);
            const ErrorMessage = error.message || "알 수 없는 오류가 발생했습니다.";
            toast.error(`${ErrorMessage}`);
        }
    };

    return (
        <Container as="form" onSubmit={handleSubmit(handleLogin)}>
            <InputForm>
                <CustomInput type="email" label="이메일 입력" {...register("email")} error={errors.email?.message} />
                <CustomInput
                    type="password"
                    label="비밀번호 입력"
                    {...register("password")}
                    error={errors.password?.message}
                />
            </InputForm>
            <CustomButton type="submit">로그인</CustomButton>
            <SocialContainer>
                <Line /> <Social>소셜 로그인</Social> <Line />
            </SocialContainer>
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
const SocialContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
    width: 35%;
`;

const Line = styled.span`
    width: 25%;
    border: 1px solid ${colors.GRAY_75};
`;

const Social = styled.p`
    padding: 0 15px;
    font-size: 14px;
    color: ${colors.GRAY_100};
`;

export default LoginPage;
