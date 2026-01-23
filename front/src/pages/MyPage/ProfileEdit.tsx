import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { updateProfile, withdrawUser } from "@/api/auth";
import CustomButton from "@/components/Common/CustomButton";
import { colors } from "@/constants";

const ProfileEdit = () => {
    const navigate = useNavigate();
    const { userData, setUser, logout } = useAuthStore();

    const [name, setName] = useState(userData?.name || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) return toast.warning("닉네임을 입력해주세요.");

        if (newPassword && !currentPassword) {
            return toast.warning("비밀번호를 변경하려면 현재 비밀번호가 필요합니다.");
        }

        try {
            const data = await updateProfile({
                name,
                currentPassword: currentPassword || undefined,
                newPassword: newPassword || undefined,
            });

            if (data.user) {
                setUser(data.user);
            }

            toast.success("회원 정보가 수정되었습니다.");

            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "수정에 실패했습니다.");
        }
    };

    const handleWithdraw = async () => {
        if (!window.confirm("정말로 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.")) return;

        try {
            await withdrawUser();
            logout();
            toast.success("회원 탈퇴가 완료되었습니다.");
            navigate("/");
        } catch (error) {
            console.error(error);
            toast.error("탈퇴 처리에 실패했습니다.");
        }
    };

    return (
        <Container>
            <Form onSubmit={handleUpdate}>
                <InputGroup>
                    <Label>이메일</Label>
                    <Input type="email" value={userData?.email} disabled />
                    <Description>이메일은 변경할 수 없습니다.</Description>
                </InputGroup>

                <InputGroup>
                    <Label>닉네임</Label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="새로운 닉네임"
                    />
                </InputGroup>

                <Divider />

                <InputGroup>
                    <Label>비밀번호 변경</Label>
                    <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="현재 비밀번호 (변경 시 필수 입력)"
                        autoComplete="new-password"
                    />
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="새 비밀번호"
                        style={{ marginTop: "8px" }}
                        autoComplete="new-password"
                    />
                    <Description>비밀번호를 변경하지 않으려면 비워두세요.</Description>
                </InputGroup>

                <ButtonWrapper>
                    <CustomButton type="submit" variant="green">
                        정보 수정 저장
                    </CustomButton>
                </ButtonWrapper>
            </Form>

            <WithdrawSection>
                <WithdrawButton type="button" onClick={handleWithdraw}>
                    회원 탈퇴하기
                </WithdrawButton>
            </WithdrawSection>
        </Container>
    );
};

export default ProfileEdit;

const Container = styled.div`
    max-width: 500px;
    background: white;
    padding: 40px;
    border-radius: 12px;
    border: 1px solid ${colors.GRAY_75 || "#eee"};
    margin: 0 auto;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-weight: 600;
    font-size: 0.95rem;
    color: ${colors.BLACK_100 || "#333"};
`;

const Input = styled.input`
    padding: 12px;
    border: 1px solid ${colors.GRAY_100 || "#ddd"};
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
        outline: none;
        border-color: ${colors.GREEN_100 || "#2E7D32"};
    }

    &:disabled {
        background-color: #f5f5f5;
        color: #888;
        cursor: not-allowed;
    }
`;

const Description = styled.span`
    font-size: 0.8rem;
    color: ${colors.GRAY_200 || "#888"};
`;

const Divider = styled.hr`
    border: none;
    border-top: 1px solid #eee;
    margin: 10px 0;
`;

const ButtonWrapper = styled.div`
    margin-top: 10px;
`;

const WithdrawSection = styled.div`
    margin-top: 40px;
    text-align: right;
    border-top: 1px solid #eee;
    padding-top: 20px;
`;

const WithdrawButton = styled.button`
    background: none;
    border: none;
    color: ${colors.GRAY_200 || "#999"};
    font-size: 0.85rem;
    text-decoration: underline;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
        color: ${colors.RED || "red"};
    }
`;
