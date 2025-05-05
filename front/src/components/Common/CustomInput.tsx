import { colors } from "@/constants";
import { forwardRef } from "react";
import styled from "styled-components";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    error?: string;
}

const CustomInput = forwardRef<HTMLInputElement, InputProps>(({ placeholder, error, ...props }, ref) => {
    return (
        <InputContainer>
            <StyledInput ref={ref} placeholder={placeholder} {...props} />
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputContainer>
    );
});

const InputContainer = styled.div`
    margin-bottom: 1rem;
    padding: 0 10px;
    max-width: 400px;
    width: 100%;
`;

const StyledInput = styled.input`
    padding: 12px 15px;
    border: 1px solid ${colors.GRAY_200};
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
    color: ${colors.BLACK_100};
    width: 400px;
    max-width: 100%;
    height: 60px;
    max-height: 100%;

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
`;

export default CustomInput;
