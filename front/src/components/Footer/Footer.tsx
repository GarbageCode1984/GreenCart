import styled from "styled-components";
import { colors } from "@/constants";

const Footer = () => {
    return (
        <Container>
            <InnerContainer>
                <Logo>GreenCart</Logo>

                <DeveloperInfo>
                    Designed & Developed by <b>S.W.S.</b>
                </DeveloperInfo>

                <TechStack>React · TypeScript · Node.js · MongoDB · Styled-Components</TechStack>

                <Copyright>© {new Date().getFullYear()}. All rights reserved.</Copyright>
            </InnerContainer>
        </Container>
    );
};

export default Footer;

const Container = styled.footer`
    width: 100%;
    background-color: #ffffff;
    border-top: 1px solid #f0f0f0;
    padding: 50px 0;
    margin-top: auto;
`;

const InnerContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
`;

const Logo = styled.h2`
    font-family: "Cinzel", serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: ${colors?.GREEN_100 || "#2E7D32"};
    margin: 0;
    letter-spacing: 1px;
    opacity: 0.8;
`;

const DeveloperInfo = styled.div`
    font-size: 0.95rem;
    color: #333;
    margin-top: 5px;

    b {
        color: ${colors?.GREEN_100 || "#2E7D32"};
        font-weight: 700;
    }
`;

const TechStack = styled.p`
    font-size: 0.85rem;
    color: #888;
    letter-spacing: 0.5px;
`;

const Copyright = styled.p`
    font-size: 0.75rem;
    color: #bbb;
    margin-top: 10px;
`;
