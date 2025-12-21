import { colors } from "@/constants";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styled from "styled-components";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <Container>
            <PageButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                <FiChevronLeft />
            </PageButton>

            {pages.map((page) => (
                <PageNumber key={page} $active={page === currentPage} onClick={() => onPageChange(page)}>
                    {page}
                </PageNumber>
            ))}

            <PageButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                <FiChevronRight />
            </PageButton>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 40px;
    margin-bottom: 20px;
`;

const PageButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
    color: #555;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
        background-color: #f9f9f9;
    }

    &:hover:not(:disabled) {
        background-color: #f0f0f0;
    }
`;

const PageNumber = styled.button<{ $active: boolean }>`
    min-width: 32px;
    height: 32px;
    padding: 0 6px;
    border: 1px solid ${(props) => (props.$active ? colors.GREEN_100 : "#ddd")};
    border-radius: 4px;
    background-color: ${(props) => (props.$active ? colors.GREEN_100 : "white")};
    color: ${(props) => (props.$active ? "white" : "#555")};
    font-weight: ${(props) => (props.$active ? "bold" : "normal")};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: ${colors.GREEN_100};
        color: ${(props) => (props.$active ? "white" : colors.GREEN_100)};
    }
`;

export default Pagination;
