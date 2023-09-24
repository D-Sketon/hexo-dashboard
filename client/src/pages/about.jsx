import React from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import GitHubIcon from "@mui/icons-material/GitHub";
import SendIcon from "@mui/icons-material/Send";

function About() {
  return (
    <Box
      sx={{
        pt: 12,
        pb: 12,
        width: "100%",
      }}
    >
      <Container>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{
            fontSize: "6rem",
          }}
        >
          Hexo dashboard
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          paragraph
          sx={{
            fontSize: "3rem",
          }}
        >
          This is the Hexo Dashboard Plugin
          <br />
          Provide an awesome admin experience for managing your blog.
        </Typography>
        <Stack
          sx={{ pt: 4 }}
          direction="row"
          spacing={5}
          justifyContent="center"
        >
          <Button
            variant="contained"
            href="https://hexo.io"
            startIcon={<SendIcon />}
            sx={{ fontSize: "2rem" }}
          >
            Hexo site
          </Button>
          <Button
            variant="outlined"
            href="https://github.com/D-Sketon/hexo-dashboard"
            startIcon={<GitHubIcon />}
            sx={{ fontSize: "2rem" }}
          >
            Github
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default About;
