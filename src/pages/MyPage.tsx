import React, { useState } from "react";
import { List, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { User } from "firebase/auth";
import NotFoundPage from "./NotFoundPage";
import LoadingPage from "./LoadingPage";
import { Song } from "../song";
import SongList from "../SongList";
import SongSubmitForm from "../SongSubmitForm";

async function getMySongs(): Promise<Song[]> {
  return [
    {
      artist: "test artist",
      title: "test title",
      url: "http://example.com/",
      comment: "this is a test",
    },
  ];
}

interface Props {
  user?: User | null;
}

const MyPage: React.FC<Props> = ({ user }) => {
  const [data, setData] = useState<undefined | Song[]>(undefined);

  if (user === undefined) {
    return <LoadingPage />;
  }
  if (user === null) {
    return <NotFoundPage />;
  }
  if (data === undefined) {
    getMySongs().then((data) => setData(data));
    return <LoadingPage />;
  }
  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Typography variant="h5">Mypage</Typography>
      <List component="nav" dense>
        <SongList data={data} filter="" collapsed={false} />
      </List>
      <SongSubmitForm />
    </Container>
  );
};

export default MyPage;
