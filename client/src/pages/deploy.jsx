import React, { useState } from "react";
import api from "../api";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";

function Deploy() {
  const [state, setState] = useState({
    stdout: "",
    stderr: "",
    error: null,
    message: "",
    status: "initial",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { message } = state;
    setState({
      message: "",
      error: null,
      stdout: "",
      stderr: "",
      status: "loading",
    });

    try {
      const result = await api.deploy(message);
      setState((prevState) => ({
        ...prevState,
        status: result.error ? "error" : "success",
        error: result.error,
        stdout: result.stdout && result.stdout.trim(),
        stderr: result.stderr && result.stderr.trim(),
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        status: "error",
        error: error.message,
      }));
    }
  };

  let body;
  if (state.error) {
    body = <h4>Error: {state.error}</h4>;
  } else if (state.status === "loading") {
    body = <h4>Loading...</h4>;
  } else if (state.status === "success") {
    body = (
      <div>
        <Typography
          component="h4"
          variant="h4"
          color="text.primary"
          gutterBottom
          sx={{
            fontSize: "5rem",
          }}
        >
          Std Out
        </Typography>
        <pre>{state.stdout}</pre>
        <Typography
          component="h4"
          variant="h4"
          color="text.primary"
          gutterBottom
          sx={{
            fontSize: "5rem",
          }}
        >
          Std Error
        </Typography>
        <pre>{state.stderr}</pre>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            pt: 8,
            pb: 8,
            width: "100%",
          }}
        >
          <Container>
            <Typography
              component="h1"
              variant="h2"
              color="text.primary"
              gutterBottom
              sx={{
                fontSize: "5rem",
              }}
            >
              Deploy
            </Typography>
            <Typography
              variant="p"
              color="text.secondary"
              sx={{
                fontSize: "2rem",
              }}
            >
              Type a message here and hit <strong>deploy</strong> to run your
              deploy script.
            </Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                margin="normal"
                placeholder="Deploy/commit message"
                variant="outlined"
                value={state.message}
                onChange={(e) =>
                  setState({ ...state, message: e.target.value })
                }
                fullWidth
                sx={{
                  ".MuiOutlinedInput-input": { fontSize: "16px" },
                  ".MuiFormLabel-root": { fontSize: "1.6rem" },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ fontSize: "2rem", ml: 4 }}
              >
                Deploy
              </Button>
            </div>
            <hr />
            {body}
          </Container>
        </Box>
      </div>
    </>
  );
}

export default Deploy;
