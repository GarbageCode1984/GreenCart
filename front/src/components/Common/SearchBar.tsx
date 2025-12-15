import styled from "styled-components";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { colors } from "@/constants";

const SearchBar = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState<string>("");

    const handleSearch = () => {
        if (keyword.trim() === "") {
            return;
        }
        navigate(`/search?q=${keyword}`);
        setKeyword("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    };

    return (
        <Container>
            <SearchInput
                type="text"
                placeholder="찾고있는 상품이 있다면?"
                value={keyword}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
            />
            <SearchIcon onClick={handleSearch} />
        </Container>
    );
};

const Container = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
`;

const SearchInput = styled.input`
    padding: 16px 12px;
    border-radius: 15px;
    border: none;
    font-size: 1rem;
    width: 100%;
    background-color: ${colors.WHITE};

    &:focus {
        outline: none;
    }
`;

const SearchIcon = styled(FiSearch)`
    position: absolute;
    width: 28px;
    height: 28px;
    right: 15px;
    color: ${colors.GREEN_100};
    cursor: pointer;
`;

export default SearchBar;
