// import { useState } from "react";

import CustomInput from "@/components/Common/CustomInput";
import styled from "styled-components";

const RegisterPage = () => {
    /* const [name, setname] = useState<string>("");
    const [email, setemail] = useState<string>("");
    const [password, setpassword] = useState<string>(""); */

    return (
        <Container>
            <CustomInput type="text" placeholder="이름 입력" />
            <CustomInput type="text" placeholder="이메일 입력" />
            <CustomInput type="text" placeholder="비밀번호 입력" />
            <CustomInput type="text" placeholder="비밀번호 확인" />
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 0 20px;
`;

export default RegisterPage;
