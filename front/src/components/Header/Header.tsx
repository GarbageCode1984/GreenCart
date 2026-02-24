import { colors } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { FaPlusSquare, FaHeart, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import SearchBar from "../Common/SearchBar";

const Header = () => {
    const { isAuth, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        logout();
        toast.info("로그아웃 되었습니다.");
        navigate("/");
    };

    const renderLoggedOutMenu = () => (
        <>
            <AuthLink to="/login">로그인</AuthLink>
            <AuthLink to="/register">회원가입</AuthLink>
        </>
    );

    const renderUserMenu = () => (
        <>
            <IconButton to="/mypage">
                <FaUser />
                <span>마이페이지</span>
            </IconButton>
            <IconButton to="/seller/add-product">
                <FaPlusSquare />
                <span>상품등록</span>
            </IconButton>
            <IconButton to="/wishlist">
                <FaHeart />
                <span>관심상품</span>
            </IconButton>
            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
        </>
    );

    return (
        <Container>
            <TopArea>
                <LogoArea>
                    <Logo to="/">GreenCart</Logo>
                </LogoArea>

                <SearchArea>
                    <SearchBar />
                </SearchArea>

                <MenuArea>{!isAuth ? renderLoggedOutMenu() : renderUserMenu()}</MenuArea>
            </TopArea>

            <KeywordArea>
                <KeywordInner>
                    <KeywordLabel>🔥 추천 키워드</KeywordLabel>
                    <TagLink to="/search?q=아이폰">#아이폰</TagLink>
                    <TagLink to="/search?q=자취템">#자취템</TagLink>
                    <TagLink to="/search?q=무료나눔">#무료나눔</TagLink>
                    <TagLink to="/search?q=패션">#패션</TagLink>
                    <TagLink to="/search?q=기프티콘">#기프티콘</TagLink>
                    <TagLink to="/search?q=가전">#가전</TagLink>
                </KeywordInner>
            </KeywordArea>
        </Container>
    );
};

export default Header;

const Container = styled.header`
    width: 100%;
    background-color: ${colors?.GREEN_100 || "#2E7D32"};
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TopArea = styled.div`
    height: 80px;
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;

    @media (max-width: 768px) {
        padding: 15px 20px;
        flex-wrap: wrap;
        height: auto;
    }
`;

const LogoArea = styled.div`
    flex: 1;
    display: flex;
    justify-content: flex-start;

    @media (max-width: 768px) {
        flex: unset;
    }
`;

const SearchArea = styled.div`
    flex: 2;
    max-width: 600px;
    width: 100%;
    display: flex;
    justify-content: center;

    @media (max-width: 768px) {
        order: 3;
        min-width: 100%;
        margin-top: 10px;
        flex: 1;
    }
`;

const MenuArea = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
    white-space: nowrap;

    @media (max-width: 768px) {
        flex: unset;
    }
`;

const Logo = styled(Link)`
    font-family: "Cinzel", serif;
    color: ${colors?.WHITE || "#FFFFFF"};
    text-decoration: none;
    font-size: clamp(1.5rem, 4vw, 2.2rem);
    font-weight: 700;
    white-space: nowrap;
`;

const AuthLink = styled(Link)`
    color: ${colors?.WHITE || "#FFFFFF"};
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    padding: 6px 10px;
    border-radius: 20px;
    transition: background-color 0.2s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.15);
    }
`;

const IconButton = styled(Link)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: ${colors?.WHITE || "#FFFFFF"};
    gap: 4px;
    transition: transform 0.2s;

    svg {
        font-size: 1.2rem;
    }

    span {
        font-size: 0.7rem;
        font-weight: 500;
    }

    &:hover {
        transform: translateY(-3px);
    }
`;

const LogoutButton = styled.button`
    background: none;
    border: none;
    color: ${colors?.WHITE || "#FFFFFF"};
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    padding: 0;
    margin-left: 10px;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.8;
        text-decoration: underline;
    }
`;

const KeywordArea = styled.div`
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0 40px;

    @media (max-width: 768px) {
        padding: 0 20px;
        justify-content: flex-start;
        overflow-x: auto;

        &::-webkit-scrollbar {
            display: none;
        }
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
`;

const KeywordInner = styled.div`
    width: 100%;
    max-width: 650px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    white-space: nowrap;
`;

const KeywordLabel = styled.span`
    color: ${colors?.WHITE || "#FFFFFF"};
    font-size: 0.85rem;
    font-weight: 700;
    margin-right: 5px;
    opacity: 0.9;
`;

const TagLink = styled(Link)`
    color: ${colors?.WHITE || "#FFFFFF"};
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 6px 14px;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.2s ease;

    &:hover {
        background-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
    }
`;
