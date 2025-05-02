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
        padding: 10px 12px;
        font-size: 0.9rem;
        width: 10%;
    `,
    medium: css`
        padding: 12px 18px;
        font-size: 1rem;
        width: 15%;
    `,
};

const variantStyles = {
    primary: css`
        background-color: ${colors.GREEN_300};
        color: ${colors.WHITE};
        border: none;
    `,
    secondary: css`
        background-color: transparent;
        color: ${colors.BLUE_200};
        border: 1px solid ${colors.BLUE_100};
    `,
};

const StyledButton = styled.button<ButtonProps>`
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    text-align: center;
    display: inline-block;
    box-sizing: border-box;

    ${({ size }) => sizeStyles[size || "medium"]}
    ${({ variant }) => variantStyles[variant || "primary"]};
`;

export default CustomButton;
