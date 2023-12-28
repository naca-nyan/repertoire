import { Typography } from "@mui/material";
import { Container } from "@mui/system";
import Header from "../components/Header";

const ErrorPage: React.FC = () => (
  <Container maxWidth="sm" sx={{ textAlign: "center" }}>
    <Header title="Error" />
    <Typography variant="h5" sx={{ pt: 6 }}>
      Error
    </Typography>
    <Typography variant="body1">エラーが発生しました。</Typography>
  </Container>
);

export default ErrorPage;
