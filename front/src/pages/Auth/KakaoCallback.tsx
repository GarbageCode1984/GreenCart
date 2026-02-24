import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled, { keyframes } from "styled-components";
import { useAuthStore } from "../../store/useAuthStore";
import { kakaoLogin } from "../../api/auth";

const KakaoCallback = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const hasFetched = useRef(false);

    useEffect(() => {
        // 1. URL에서 카카오 인가 코드 추출
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");

        // 코드가 있고, 아직 1회용 코드를 사용하지 않았을 때만 실행
        if (code && !hasFetched.current) {
            hasFetched.current = true; // 코드 사용 완료 표시

            const processKakaoLogin = async () => {
                try {
                    // 2. 백엔드로 코드 전송하여 토큰 및 유저 정보 받아오기
                    const data = await kakaoLogin(code);

                    // 3. 기존 로그인 로직과 동일하게 토큰 저장 및 스토어 업데이트
                    localStorage.setItem("token", data.token);
                    login(data.user);

                    toast.success(`${data.user.name}님 환영합니다!`);
                    navigate("/");
                } catch (error) {
                    console.error("카카오 로그인 에러:", error);
                    toast.error("카카오 로그인 인증에 실패했습니다.");
                    navigate("/login");
                }
            };
            processKakaoLogin();
        } else if (!code && !hasFetched.current) {
            toast.error("카카오 인가 코드가 존재하지 않습니다.");
            navigate("/login");
        }
    }, [navigate, login]);

    return (
        <Container>
            <Spinner />
            <Title>카카오 로그인 처리 중입니다...</Title>
            <SubText>잠시만 기다려주세요.</SubText>
        </Container>
    );
};

export default KakaoCallback;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 20px;
    font-family: "Pretendard", sans-serif;
`;

const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const Spinner = styled.div`
    width: 48px;
    height: 48px;
    border: 4px solid #fee500;
    border-top-color: transparent;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
`;

const Title = styled.h2`
    font-size: 1.25rem;
    font-weight: 700;
    color: #374151;
    margin: 0;
`;

const SubText = styled.p`
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
`;
