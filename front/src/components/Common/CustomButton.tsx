import { colors } from "@/constants";
import styled, { css } from "styled-components";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    size?: "small" | "medium";
    variant?: "primary" | "secondary";
}

const CustomButton = ({ children, size = "medium", variant = "primary", ...props }: ButtonProps) => {
    return (
        <StyledButton size={size} variant={variant} {...props}>
            {children}
        </StyledButton>
    );
};

const sizeStyles = {
    small: css`
        padding: 8px 12px;
        font-size: 0.9rem;
        width: 130px;
        max-width: 50%;
        height: 50px;
    `,
    medium: css`
        padding: 12px 15px;
        font-size: 1rem;
        width: 380px;
        max-width: 95%;
        height: 60px;
    `,
};

const variantStyles = {
    primary: css`
        background-color: ${colors.GREEN_300};
        color: ${colors.WHITE};
        border: none;

        &:active:not(:disabled) {
            background-color: ${colors.GREEN_200};
        }
    `,

    secondary: css`
        background-color: transparent;
        color: ${colors.BLUE_200};
        border: 1px solid ${colors.BLUE_100};

        &:active:not(:disabled) {
            background-color: ${colors.BLUE_50};
        }
    `,
};

const StyledButton = styled.button<ButtonProps>`
    font-weight: bold;
    cursor: pointer;
    text-align: center;
    display: inline-block;
    box-sizing: border-box;
    transition: background-color 0.2s ease-in-out;

    ${({ size }) => sizeStyles[size || "medium"]}
    ${({ variant }) => variantStyles[variant || "primary"]};
`;

export default CustomButton;
