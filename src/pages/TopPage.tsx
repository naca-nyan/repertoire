import React, { useContext } from "react";
import { Button, Divider, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { UserStateContext } from "../contexts/user";
import LoadingPage from "./LoadingPage";
import { Link } from "react-router-dom";

const TopPage: React.FC = () => {
  const us = useContext(UserStateContext);
  return (
    <Container maxWidth="sm" sx={{ pt: 2, textAlign: "center" }}>
      <Typography variant="h5" sx={{ mt: 10, color: "primary" }}>
        『Repertoire』
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, mb: 6, mx: 10 }}>
        は演奏できるレパートリーのコード譜や楽譜を登録して、みんなと共有できるサービスです。
      </Typography>
      <Divider />
      {us.state === "loading" ? (
        <LoadingPage />
      ) : us.state === "signed out" ? (
        <>
          <Typography sx={{ mt: 6, mb: 1 }}>始めるには</Typography>
          <Button
            onClick={us.signIn}
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Twitter でログイン
          </Button>
        </>
      ) : (
        <>
          <Typography sx={{ mt: 6, mb: 1 }}>
            ようこそ {us.user.displayName} さん
          </Typography>
          <Link to="/mypage" style={{ textDecoration: "none" }}>
            <Button variant="outlined">マイページへ</Button>
          </Link>
        </>
      )}
    </Container>
  );
};

export default TopPage;
