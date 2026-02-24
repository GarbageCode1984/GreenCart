import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "./components/Header/Header";
import { colors } from "@/constants";
import Footer from "./components/Footer/Footer";

const App = () => {
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
