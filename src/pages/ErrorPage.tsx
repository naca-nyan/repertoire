import { Typography } from "@mui/material";
import { Container } from "@mui/system";

const ErrorPage: React.FC = () => (
  <Container maxWidth="sm" sx={{ textAlign: "center" }}>
    <Typography variant="h5" sx={{ pt: 6 }}>
      Error
    </Typography>
    <Typography variant="body1">エラーが発生しました。</Typography>
  </Container>
);

export default ErrorPage;
