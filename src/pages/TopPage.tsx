import React, { useContext } from "react";
import { Button, Divider, Link as MuiLink, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { UserStateContext } from "../contexts/user";
import LoadingPage from "./LoadingPage";
import { Link } from "react-router-dom";
import { signIn } from "../auth";
import Header from "../components/Header";

const TopPage: React.FC = () => {
  const us = useContext(UserStateContext);
  return (
    <Container maxWidth="sm" sx={{ pt: 2, textAlign: "center" }}>
      <Header title="" />
      <Typography variant="h5" sx={{ mt: 10, color: "primary" }}>
        『Repertoire』
      </Typography>
      <Typography sx={{ mt: 1, mx: 10 }}>
        は演奏できるレパートリーのコード譜や楽譜を登録して、みんなと共有できるサービスです。
      </Typography>
      <Typography sx={{ mt: 1, mb: 6, mx: 10 }}>
        使い方は
        <MuiLink
          href="https://github.com/naca-nyan/repertoire/wiki"
          target="_blank"
        >
          こちら
        </MuiLink>
      </Typography>
      <Divider />
      {us.state === "loading" ? (
        <LoadingPage />
      ) : us.state === "signedOut" ? (
        <>
          <Typography sx={{ mt: 6, mb: 1 }}>始めるには</Typography>
          <Button
            onClick={signIn}
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
