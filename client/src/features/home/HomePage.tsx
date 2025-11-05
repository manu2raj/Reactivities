import { Container, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Container>
        <Typography variant="h3" align="center" sx={{mt: 5}}>
            Home Page
        </Typography>
        <Typography variant="h5" align="center" sx={{mt: 5}}>
            Welcome to Reactivities : A React Activity Management App
        </Typography>
    </Container>
  )
}
