import { colors } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { FaPlusSquare, FaHeart, FaShoppingCart, FaTruck, FaUser } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

const Header = () => {
    const { isAuth, logout, userData } = useAuthStore();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        logout();
        toast.info("로그아웃 되었습니다.");
    };

    const renderLoggedOutMenu = () => (
        <UserMenu>
            <LoginButton to="/login">로그인</LoginButton>
            <SignupButton to="/register">회원가입</SignupButton>
        </UserMenu>
    );

    const renderUserMenu = () => (
        <IconMenu>
            <IconButton to="/wishlist">
                <FaHeart />
                <IconText>관심상품</IconText>
            </IconButton>
            <IconButton to="/mypage">
                <FaUser />
                <IconText>마이페이지</IconText>
            </IconButton>
            <IconButton to="/cart">
                <FaShoppingCart />
                <IconText>장바구니</IconText>
            </IconButton>
            <IconButton to="/orders">
                <FaTruck />
                <IconText>주문배송조회</IconText>
            </IconButton>
            <Logout onClick={handleLogout}>로그아웃</Logout>
        </IconMenu>
    );

    const renderSellerMenu = () => (
        <IconMenu>
            <IconButton to="/mypage">
                <FaUser />
                <IconText>마이페이지</IconText>
            </IconButton>
            <IconButton to="/seller/add-product">
                <FaPlusSquare />
                <IconText>상품등록</IconText>
            </IconButton>
            <IconButton to="/seller/orders">
                <FaTruck />
                <IconText>주문관리</IconText>
            </IconButton>
            <Logout onClick={handleLogout}>로그아웃</Logout>
        </IconMenu>
    );

    return (
        <>
            <HeaderContainer>
                <Logo to="/">GreenCart</Logo>
                <SearchContainer>
                    <SearchInput type="text" placeholder="찾고있는 상품이 있다면?" />
                    <SearchIcon />
                </SearchContainer>
                {!isAuth ? renderLoggedOutMenu() : userData?.role === "seller" ? renderSellerMenu() : renderUserMenu()}
            </HeaderContainer>
            <NavContainer>
                <NavItem to="/best">베스트</NavItem>
                <NavItem to="/discount">할인·특가상품</NavItem>
                <NavItem to="/new">신상품</NavItem>
                <NavItem to="/event">이벤트</NavItem>
            </NavContainer>
        </>
    );
};

const HeaderContainer = styled.header`
    position: relative;
    height: 100px;
    width: 100%;
    display: flex;
    align-items: center;
    background-color: ${colors.GREEN_100};
    padding: 0 20px;
    box-sizing: border-box;
`;

const Logo = styled(Link)`
    font-family: "Cinzel", serif;
    color: ${colors.WHITE};
    text-decoration: none;
    padding-bottom: 15px;
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 600;
`;

const SearchContainer = styled.div`
    max-width: 600px;
    width: 100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 15px;
    margin: 0 auto;
    align-items: center;
`;

const SearchInput = styled.input`
    padding: 16px 12px;
    border-radius: 15px;
    border: none;
    font-size: 1rem;
    width: 100%;
    &:focus {
        outline: none;
    }
`;

const SearchIcon = styled(FiSearch)`
    position: absolute;
    width: 28px;
    height: 28px;
    right: 8px;
    color: ${colors.GREEN_100};
    cursor: pointer;
    transform: translateY(35%);
`;

const UserMenu = styled.div`
    display: flex;
    position: absolute;
    right: 1%;
`;

const IconMenu = styled.div`
    display: flex;
    position: absolute;
    right: 1%;
`;

const IconButton = styled(Link)`
    display: flex;
    align-items: center;
    flex-direction: column;
    text-decoration: none;
    color: ${colors.WHITE};
    font-size: 1.2rem;
    padding: 0 5px;
`;

const IconText = styled.p`
    margin-top: 2px;
    color: ${colors.WHITE};
    font-size: 0.7rem;
`;

const LoginButton = styled(Link)`
    color: ${colors.WHITE};
    text-decoration: none;
    font-weight: 600;
    padding: 6px 8px;
    border-radius: 20px;
    cursor: pointer;
`;

const SignupButton = styled(Link)`
    color: ${colors.WHITE};
    text-decoration: none;
    font-weight: 600;
    padding: 6px 8px;
    margin-right: 50px;
    border-radius: 20px;
    cursor: pointer;
`;

const NavContainer = styled.nav`
    position: absolute;
    top: 100px;
    width: 100%;
    height: 50px;
    background-color: ${colors.GREEN_100};
    display: flex;
    justify-content: center;
    gap: 50px;
    z-index: 1000;
`;

const NavItem = styled(Link)`
    color: ${colors.BLACK_100};
    font-weight: 600;
    font-size: 1.3rem;
    text-decoration: none;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.3s;

    &:hover {
        color: ${colors.WHITE};
    }
`;

const Logout = styled.button`
    background: none;
    color: ${colors.WHITE};
    border: none;
    padding-left: 3px;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    font-size: 12px;
`;

export default Header;
