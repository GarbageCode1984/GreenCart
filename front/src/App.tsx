import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "./components/Header/Header";
import { colors } from "@/constants";
import Footer from "./components/Footer/Footer";

function App() {
    return (
        <AppContainer>
            <Header />
            <MainContent>
                <Outlet />
            </MainContent>
            <Footer />
        </AppContainer>
    );
}

const AppContainer = styled.div`
    position: relative;
    min-height: 100vh;
    background-color: ${colors.WHITE};
`;
const MainContent = styled.main`
    padding-top: 150px;
    min-height: calc(100vh - 150px);
`;

export default App;
