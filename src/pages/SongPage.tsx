import React, {
  ChangeEventHandler,
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { useDebounce } from "react-use";
import {
  Box,
  Button,
  Container,
  Divider,
  Input,
  List,
  ListSubheader,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";

import { getSongs, Songs } from "../data/song";
import SongList from "../components/SongList";
import NotFoundPage from "./NotFoundPage";
import LoadingPage from "./LoadingPage";
import { UserStateContext } from "../contexts/user";
import { getScreenName } from "../data/user";

const SongListSubHeader: React.FC<{
  collapsed: boolean;
  onChangeSearchWord: ChangeEventHandler<HTMLInputElement>;
  onClickToggleButton: MouseEventHandler;
}> = ({ collapsed, onChangeSearchWord, onClickToggleButton }) => {
  return (
    <ListSubheader component="div">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "flex-end", flexGrow: 1 }}>
          <Search sx={{ my: 0.5, mr: 1 }} />
          <Input placeholder="Search..." onChange={onChangeSearchWord} />
        </Box>
        <Button size="small" onClick={onClickToggleButton}>
          {collapsed ? "Open" : "Close"} All
        </Button>
      </Toolbar>
      <Divider />
    </ListSubheader>
  );
};

const SongPageContent: React.FC<{
  data: Songs;
  loginUserId: string | undefined | null;
  loginUserData: Songs | undefined;
}> = ({ data }) => {
  const [searchWord, setSearchWord] = useState("");
  const [debouncedSearchWord, setDebouncedSearchWord] = useState("");
  useDebounce(() => setDebouncedSearchWord(searchWord), 300, [searchWord]);

  const [collapsed, setCollapsed] = useState(false);

  const subheader = SongListSubHeader({
    collapsed,
    onChangeSearchWord: (e) => setSearchWord(e.currentTarget.value),
    onClickToggleButton: () => setCollapsed(!collapsed),
  });
  return (
    <Paper elevation={3} sx={{ mt: 2 }}>
      <List component="nav" dense subheader={subheader}>
        <SongList
          data={data}
          filter={debouncedSearchWord}
          collapsed={collapsed}
        />
      </List>
    </Paper>
  );
};

const SongPage: React.FC = () => {
  const { userId: subjectUserId } = useParams();
  const [subjectData, setSubjectData] = useState<undefined | null | Songs>(
    undefined
  );

  useEffect(() => {
    if (!subjectUserId) {
      setSubjectData(null);
      return;
    }
    getSongs(subjectUserId)
      .then(setSubjectData)
      .catch((e) => {
        console.warn(e);
        setSubjectData(null);
      });
  }, [subjectUserId]);

  const us = useContext(UserStateContext);
  const [loginUserData, setLoginUserData] = useState<undefined | Songs>(
    undefined
  );

  useEffect(() => {
    if (us.state !== "signed in") return;
    const loginUser = us.user;
    const loginUserId = getScreenName(loginUser);
    if (!loginUserId) return;
    getSongs(loginUserId).then(setLoginUserData);
  }, [us]);

  if (!subjectUserId) return <NotFoundPage />;
  if (subjectData === undefined) return <LoadingPage />;
  if (subjectData === null) return <NotFoundPage />;

  const loginUser = us.state === "signed in" ? us.user : null;
  const loginUserId = loginUser ? getScreenName(loginUser) : null;

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Typography variant="h6">@{subjectUserId} さんの知ってる曲</Typography>
      <SongPageContent
        data={subjectData}
        loginUserId={loginUserId}
        loginUserData={loginUserData}
      />
    </Container>
  );
};
export default SongPage;
