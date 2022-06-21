import { Typography } from "@mui/material";
import { Container } from "@mui/system";

const UnauthorizedPage: React.FC = () => (
  <Container maxWidth="sm" sx={{ textAlign: "center" }}>
    <Typography variant="h5" sx={{ pt: 6 }}>
      Unauthorized
    </Typography>
    <Typography variant="body1">
      このページにアクセスするにはログインが必要です。
    </Typography>
  </Container>
);

export default UnauthorizedPage;
