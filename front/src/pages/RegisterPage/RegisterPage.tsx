// import { useState } from "react";

import CustomButton from "@/components/Common/CustomButton";
import CustomInput from "@/components/Common/CustomInput";
import styled from "styled-components";

const RegisterPage = () => {
    /* const [name, setname] = useState<string>("");
    const [email, setemail] = useState<string>("");
    const [password, setpassword] = useState<string>(""); */

    return (
        <Container>
            <InputForm>
                <CustomInput type="text" label="이름 입력" />
                <CustomInput type="email" label="이메일 입력" />
                <CustomInput type="password" label="비밀번호 입력" />
                <CustomInput type="password" label="비밀번호 확인" />
            </InputForm>
            <CustomButton>회원가입</CustomButton>
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

const InputForm = styled.div`
    margin-bottom: 25px;
`;

export default RegisterPage;
