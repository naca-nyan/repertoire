import { Container } from "@mui/system";
import { User } from "firebase/auth";
import React from "react";

interface Props {
  user?: User;
}

const MyPage: React.FC<Props> = ({ user }) => {
  return <Container maxWidth="lg">Mypage</Container>;
};

export default MyPage;
