import { colors } from "@/constants";
import React, { TextareaHTMLAttributes } from "react";
import styled from "styled-components";

type CustomTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    error?: string;
};

const CustomTextarea = React.forwardRef<HTMLTextAreaElement, CustomTextareaProps>(({ error, ...props }, ref) => {
    return (
        <>
            <StyledTextarea ref={ref} error={!!error} {...props} />
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </>
    );
});

const StyledTextarea = styled.textarea<{ error: boolean }>`
    padding: 10px 15px;
    border: 1px solid ${(props) => (props.error ? colors.RED : colors.GRAY_25)};
    border-radius: 4px;
    font-size: 16px;
    width: 100%;
    min-height: 120px;
    resize: vertical;
    line-height: 1.5;

    &:focus {
        border-color: ${colors.GREEN_100};
        outline: none;
        box-shadow: 0 0 0 0.02rem rgba(67, 255, 117, 0.695);
    }
`;
const ErrorMessage = styled.p`
    color: ${colors.RED};
    font-size: 14px;
    margin-top: 5px;
`;

export default CustomTextarea;
