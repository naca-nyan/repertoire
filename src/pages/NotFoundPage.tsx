import { Typography } from "@mui/material";
import { Container } from "@mui/system";
import Header from "../components/Header";

const NotFoundPage: React.FC = () => (
  <Container maxWidth="sm" sx={{ textAlign: "center" }}>
    <Header title="Not Found" />
    <Typography variant="h5" sx={{ pt: 6 }}>
      Not Found
    </Typography>
    <Typography variant="body1">
      お探しのページは見つかりませんでした。
    </Typography>
  </Container>
);

export default NotFoundPage;
