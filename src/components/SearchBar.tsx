import React, { useState } from "react";
import { useDebounce } from "react-use";
import {
  alpha,
  IconButton,
  InputAdornment,
  InputBase,
  styled,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 10,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    margin: "0 auto",
    width: "auto",
    maxWidth: theme.breakpoints.values.sm,
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
  },
}));

const SearchBar: React.FC<{
  onInput: (v: string) => void;
}> = ({ onInput }) => {
  const [input, setInput] = useState("");
  useDebounce(() => onInput(input), 300, [input]);
  const [showClearButton, setShowClearButton] = useState(false);
  const ClearButon = (
    <InputAdornment position="end">
      <IconButton
        disableRipple
        onClick={() => {
          setInput("");
          setShowClearButton(false);
        }}
      >
        <ClearIcon />
      </IconButton>
    </InputAdornment>
  );
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        value={input}
        placeholder="Search..."
        inputProps={{ "aria-label": "search" }}
        endAdornment={showClearButton && ClearButon}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => setShowClearButton(true)}
        onBlur={() => input || setShowClearButton(false)}
      />
    </Search>
  );
};

export default SearchBar;
