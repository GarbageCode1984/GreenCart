import { registerUser } from "@/api/auth";
import CustomButton from "@/components/Common/CustomButton";
import CustomInput from "@/components/Common/CustomInput";
import { RegisterFormData } from "@/types/types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/utils/validation/authSchemas";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { colors } from "@/constants";

const UserRegisterPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({ resolver: yupResolver(registerSchema) });

    const navigate = useNavigate();

    const handleRegister = async (data: RegisterFormData) => {
        try {
            await registerUser(data);
            toast.success("회원가입 성공!");
            navigate("/login");
        } catch (error) {
            const ErrorMessage = error.message || "알 수 없는 오류가 발생했습니다.";

            toast.error(`${ErrorMessage}`);
        }
    };

    return (
        <Container as="form" onSubmit={handleSubmit(handleRegister)}>
            <InputForm>
                <CustomInput type="text" label="이름 입력" {...register("name")} error={errors.name?.message} />
                <CustomInput type="email" label="이메일 입력" {...register("email")} error={errors.email?.message} />
                <CustomInput
                    type="password"
                    label="비밀번호 입력"
                    {...register("password")}
                    error={errors.password?.message}
                />
                <CustomInput
                    type="password"
                    label="비밀번호 확인"
                    {...register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                />
            </InputForm>
            <CustomButton type="submit">회원가입</CustomButton>
            <SellerRegister to="/sellerRegister">판매자로 가입하기</SellerRegister>
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

const SellerRegister = styled(Link)`
    width: 20%;
    margin-top: 10px;
    font-size: 14px;
    color: ${colors.GRAY_200};
`;

export default UserRegisterPage;
