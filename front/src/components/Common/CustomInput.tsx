import { colors } from "@/constants";
import { forwardRef } from "react";
import styled, { css } from "styled-components";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    inputSize?: "medium" | "large";
}

const CustomInput = forwardRef<HTMLInputElement, InputProps>(
    ({ label, inputSize = "medium", error, ...props }, ref) => {
        return (
            <InputContainer>
                <StyledInput placeholder={label} {...props} ref={ref} inputSize={inputSize} />
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </InputContainer>
        );
    }
);

const InputContainer = styled.div`
    margin-bottom: 1rem;
    padding: 0 10px;
    max-width: 1200px;
    width: 100%;
`;

const sizeStyles = {
    medium: css`
        height: 60px;
        font-size: 1rem;
        padding: 12px 15px;
        width: 400px;
    `,
    large: css`
        font-size: 1.1rem;
        padding: 16px 20px;
        width: 1200px;
    `,
};

const StyledInput = styled.input<Pick<InputProps, "inputSize">>`
    border: 1px solid ${colors.GRAY_200};
    border-radius: 4px;
    box-sizing: border-box;
    color: ${colors.BLACK_100};

    max-width: 100%;
    max-height: 100%;

    ${({ inputSize }) => inputSize && sizeStyles[inputSize]}

    &:focus {
        outline: none;
        border-color: ${colors.GREEN_300};
        box-shadow: 0 0 0 0.2rem rgba(${colors.GREEN_100}, 0.25);
    }

    &::placeholder {
        color: ${colors.GRAY_100};
        opacity: 1;
    }
`;

const ErrorMessage = styled.p`
    color: ${colors.RED_100};
    font-size: 0.85rem;
    margin-top: 4px;
`;

export default CustomInput;
