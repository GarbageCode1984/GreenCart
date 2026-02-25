import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiHome, FiArrowUp, FiArrowDown, FiArrowLeft } from "react-icons/fi";
import { colors } from "@/constants";

const FloatingNav = () => {
    const navigate = useNavigate();
    const [, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    };

    const goToHome = () => {
        navigate("/");
        window.scrollTo(0, 0);
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <NavWrapper>
            <NavButton onClick={goBack} title="뒤로 가기">
                <FiArrowLeft />
            </NavButton>

            <NavButton onClick={goToHome} title="메인으로">
                <FiHome />
            </NavButton>

            <ScrollGroup>
                <NavButton onClick={scrollToTop} title="맨 위로">
                    <FiArrowUp />
                </NavButton>
                <NavButton onClick={scrollToBottom} title="맨 아래로">
                    <FiArrowDown />
                </NavButton>
            </ScrollGroup>
        </NavWrapper>
    );
};

export default FloatingNav;

const NavWrapper = styled.div`
    position: fixed;
    bottom: 40px;
    right: 40px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 1000;
    @media (max-width: 768px) {
        bottom: 20px;
        right: 20px;
    }
`;

const ScrollGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0;
    background-color: white;
    border-radius: 25px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    & > button {
        border-radius: 0;
        box-shadow: none;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
            border-bottom: none;
        }
    }
`;

const NavButton = styled.button`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background-color: white;
    color: ${colors.BLACK_100 || "#333"};
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: ${colors.GREEN_100 || "#2E7D32"};
        color: white;
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
`;
