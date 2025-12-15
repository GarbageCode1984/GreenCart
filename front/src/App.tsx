import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "./components/Header/Header";
import { colors } from "@/constants";
import Footer from "./components/Footer/Footer";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { isTokenExpired } from "./utils/authUtils";

const App = () => {
    const logout = useAuthStore((state) => state.logout);
    const isAuth = useAuthStore((state) => state.isAuth);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");

            if (!token) return logout();

            if (isTokenExpired(token)) {
                console.log("토큰 만료");
                logout();
                localStorage.removeItem("token");
            }
        };
        checkAuth();
    }, [isAuth, logout]);

    return (
        <AppContainer>
            <Header />
            <MainContent>
                <Outlet />
            </MainContent>
            <Footer />
        </AppContainer>
    );
};

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: ${colors.WHITE};
`;
const MainContent = styled.main`
    flex: 1;
`;

export default App;
