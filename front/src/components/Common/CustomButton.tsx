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
        max-width: 100%;
        height: 50px;
    `,
    medium: css`
        padding: 14px 20px;
        font-size: 1.1rem;
        width: 100%;
        max-width: 400px;
        height: 55px;
    `,
};

const variantStyles = {
    primary: css`
        background-color: ${colors.GREEN_300};
        color: ${colors.WHITE};
        border: none;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `,

    secondary: css`
        background-color: transparent;
        color: ${colors.BLUE_200};
        border: 1px solid ${colors.BLUE_100};
    `,
};

const StyledButton = styled.button<ButtonProps>`
    font-weight: bold;
    cursor: pointer;
    text-align: center;
    display: block;
    box-sizing: border-box;
    transition: background-color 0.2s ease-in-out;
    margin: 0 auto;

    ${({ size }) => sizeStyles[size || "medium"]}
    ${({ variant }) => variantStyles[variant || "primary"]};

    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
`;

export default CustomButton;
