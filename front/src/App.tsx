import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "./components/Header/Header";
import { colors } from "@/constants";

function App() {
    return (
        <AppContainer>
            <Header />
            <main>
                <Outlet />
            </main>
        </AppContainer>
    );
}

const AppContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: ${colors.WHITE};
`;

export default App;
