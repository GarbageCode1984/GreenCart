import { colors } from "@/constants";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import styled from "styled-components";

function Header() {
    return (
        <>
            <HeaderContainer>
                <Logo to="/">GreenCart</Logo>
                <SearchContainer>
                    <SearchInput type="text" placeholder="찾고있는 상품이 있다면?" />
                    <SearchIcon />
                </SearchContainer>

                <UserMenu>
                    <LoginButton to="/login">로그인</LoginButton>
                    <SignupButton to="/register">회원가입</SignupButton>
                </UserMenu>

                <NavMenu>
                    <NavItem to="/best">베스트</NavItem>
                    <NavItem to="/discount">할인·특가상품</NavItem>
                    <NavItem to="/new">신상품</NavItem>
                    <NavItem to="/event">이벤트</NavItem>
                </NavMenu>
            </HeaderContainer>
        </>
    );
}

const HeaderContainer = styled.header`
    position: fixed;
    height: 100px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${colors.WHITE};
    padding: 0 23px;
    z-index: 1000;
`;

const Logo = styled(Link)`
    font-family: "Cinzel", serif;
    color: ${colors.GREEN_100};
    text-decoration: none;
    padding-bottom: 20px;
    padding-left: 25px;
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 600;
`;

const SearchContainer = styled.div`
    flex: 1;
    max-width: 500px;
    display: flex;
    position: relative;
    border-radius: 15px;
    margin: 0 auto;
    align-items: center;
    border: 2px solid ${colors.GREEN_100};
`;

const SearchInput = styled.input`
    flex: 1;
    padding: 16px 12px;
    border-radius: 15px;
    border: none;
    font-size: 1rem;
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
`;

const UserMenu = styled.div`
    display: flex;
`;

const LoginButton = styled(Link)`
    color: ${colors.GREEN_100};
    text-decoration: none;
    font-weight: 600;
    padding: 6px 8px;
    border-radius: 20px;
    cursor: pointer;
`;

const SignupButton = styled(Link)`
    color: ${colors.GREEN_100};
    text-decoration: none;
    font-weight: 600;
    padding: 6px 8px;
    margin-right: 50px;
    border-radius: 20px;
    cursor: pointer;
`;

const NavMenu = styled.nav`
    position: fixed;
    top: 100px;
    width: 100%;
    height: 5%;
    background-color: ${colors.WHITE};
    display: flex;
    justify-content: center;
    gap: 60px;
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
        color: ${colors.GREEN_100};
    }
`;

export default Header;
