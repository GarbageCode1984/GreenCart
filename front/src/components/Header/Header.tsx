import { colors } from "@/constants";
import { FiSearch } from "react-icons/fi";
import styled from "styled-components";

function Header() {
    return (
        <>
            <HeaderContainer>
                <Logo href="/">GreenCart</Logo>
                <SearchContainer>
                    <SearchInput type="text" placeholder="찾고있는 상품이 있다면?" />
                    <SearchIcon />
                </SearchContainer>
                <UserMenu>
                    <LoginButton href="/login">로그인</LoginButton>
                    <SignupButton href="/signup">회원가입</SignupButton>
                </UserMenu>

                <NavMenu>
                    <NavItem href="/best">베스트</NavItem>
                    <NavItem href="/discount">할인·특가상품</NavItem>
                    <NavItem href="/new">신상품</NavItem>
                    <NavItem href="/event">이벤트</NavItem>
                </NavMenu>
            </HeaderContainer>
        </>
    );
}

const HeaderContainer = styled.header`
    position: fixed;
    height: 100px;
    width: 100%;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${colors.WHITE};
`;

const Logo = styled.a`
    font-weight: bold;
    font-size: 1.8rem;
    color: ${colors.GREEN_100};
    text-decoration: none;
    padding-bottom: 20px;
    padding-left: 30px;
`;

const SearchContainer = styled.div`
    flex: 1;
    max-width: 500px;
    display: flex;
    position: relative;
    border-radius: 15px;
    margin: 0 20px;
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

const LoginButton = styled.a`
    color: ${colors.GREEN_100};
    text-decoration: none;
    font-weight: 600;
    padding: 6px 8px;
    border-radius: 20px;
    cursor: pointer;
`;

const SignupButton = styled.a`
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
    background-color: ${colors.WHITE};
    display: flex;
    justify-content: center;
    gap: 70px;
    padding: 12px 0;
`;

const NavItem = styled.a`
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
