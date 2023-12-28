import { Typography } from "@mui/material";
import { Container } from "@mui/system";
import Header from "../components/Header";

const UnauthorizedPage: React.FC = () => (
  <Container maxWidth="sm" sx={{ textAlign: "center" }}>
    <Header title="Unauthorized" />
    <Typography variant="h5" sx={{ pt: 6 }}>
      Unauthorized
    </Typography>
    <Typography variant="body1">
      このページにアクセスするにはログインが必要です。
    </Typography>
  </Container>
);

export default UnauthorizedPage;
