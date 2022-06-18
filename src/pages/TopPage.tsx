import React from "react";
import { Button, Divider, Typography } from "@mui/material";
import { Container } from "@mui/system";

const TopPage: React.FC = () => (
  <Container maxWidth="sm" sx={{ pt: 2, textAlign: "center" }}>
    <Typography variant="h5" sx={{ mt: 10, color: "primary" }}>
      『Repertoire』
    </Typography>
    <Typography variant="body1" sx={{ mt: 1, mb: 6, mx: 10 }}>
      は演奏できるレパートリーのコード譜や楽譜を登録して、みんなと共有できるサービスです。
    </Typography>
    <Divider />
    <Typography sx={{ mt: 6, mb: 1 }}>始めるには</Typography>
    <Button variant="outlined">Twitter でログイン</Button>
  </Container>
);

export default TopPage;
