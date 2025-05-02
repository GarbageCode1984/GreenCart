// import { useState } from "react";

import CustomButton from "@/components/Common/CustomButton";

const RegisterPage = () => {
    /* const [name, setname] = useState<string>("");
    const [email, setemail] = useState<string>("");
    const [password, setpassword] = useState<string>(""); */

    return (
        <div>
            Register
            <CustomButton type="submit">비밀번호 재설정 이메일 발송</CustomButton>
            <CustomButton size="small" type="submit">
                회원가입
            </CustomButton>
            <CustomButton variant="secondary" size="small" type="submit">
                회원가입
            </CustomButton>
        </div>
    );
};

export default RegisterPage;
