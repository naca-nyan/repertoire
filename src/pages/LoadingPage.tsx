import { CircularProgress } from "@mui/material";
import { Container } from "@mui/system";

const LoadingPage = () => (
  <Container sx={{ mt: 5, textAlign: "center" }}>
    <CircularProgress />
  </Container>
);

export default LoadingPage;
