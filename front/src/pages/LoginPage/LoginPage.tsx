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
import { Link } from "react-router-dom";

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
            const ErrorMessage = error.message || "알 수 없는 오류가 발생했습니다.";
            toast.error(`${ErrorMessage}`);
        }
    };

    const handleKakaoLogin = () => {
        const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY;
        const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;

        if (!clientId || !redirectUri) {
            toast.error("카카오 로그인 설정이 누락되었습니다.");
            return;
        }

        const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

        window.location.href = KAKAO_AUTH_URL;
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

            <SocialButtonGroup>
                <KakaoButton type="button" onClick={handleKakaoLogin} title="카카오로 로그인">
                    <img
                        src="/kakao-icon.png"
                        alt="카카오 로그인"
                        style={{ width: "24px", height: "24px", objectFit: "contain" }}
                    />
                </KakaoButton>
            </SocialButtonGroup>

            <BottomLinks>
                <span>아직 회원이 아니신가요?</span>
                <StyledLink to="/register">회원가입</StyledLink>
            </BottomLinks>
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

const SocialButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    margin-bottom: 10px;
`;

const KakaoButton = styled.button`
    width: 100%;
    padding: 14px;
    background-color: #fee500;
    color: #000000;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background-color 0.2s;

    &:hover {
        filter: brightness(0.95);
    }
`;

const BottomLinks = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 25px;
    font-size: 0.9rem;
    color: ${colors?.GRAY_200 || "#666"};
`;

const StyledLink = styled(Link)`
    color: ${colors?.GREEN_100 || "#2E7D32"};
    font-weight: 600;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

export default LoginPage;
