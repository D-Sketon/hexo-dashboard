import React, { useState, useEffect } from "react";
import bcrypt from "bcryptjs";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

function AdminYaml({ username, password, secret }) {
  const [passwordHash, setPasswordHash] = useState(
    "$2a$10$L.XAIqIWgTc5S1zpvV3MEu7/rH34p4Is/nq824smv8EZ3lIPCp1su"
  );

  useEffect(() => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    setPasswordHash(hash);
  }, [password]);

  const adminYaml = [
    "# hexo-admin authentification",
    "admin:",
    `  username: ${username}`,
    `  password_hash: ${passwordHash}`,
    `  secret: ${secret}`,
  ].join("\n");

  return <pre>{adminYaml}</pre>;
}

function AuthSetup() {
  const [username, setUsername] = useState("username");
  const [password, setPassword] = useState("password");
  const [secret, setSecret] = useState("my super secret phrase");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSecretChange = (e) => {
    setSecret(e.target.value);
  };

  return (
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
            Authentication Setup
          </Typography>
          <Typography
            variant="p"
            color="text.secondary"
            sx={{
              fontSize: "2rem",
            }}
          >
            <p>
              You can secure hexo-admin with a password by adding a section to
              your&nbsp;
              <code>_config.yml</code>. This page is here to easily get it set
              up. Simply fill in the following fields and copy and paste the
              generated text section into your config file.
            </p>
          </Typography>
          <TextField
            margin="normal"
            variant="outlined"
            label="Username"
            value={username}
            placeholder="The username you'll use to log in."
            onChange={handleUsernameChange}
            fullWidth
            sx={{
              ".MuiOutlinedInput-input": { fontSize: "16px" },
              ".MuiFormLabel-root": { fontSize: "1.6rem" },
            }}
          />
          <TextField
            margin="normal"
            variant="outlined"
            label="Password"
            value={password}
            placeholder="The password you'll use to log in. This will be encrypted to store in your config."
            onChange={handlePasswordChange}
            fullWidth
            sx={{
              ".MuiOutlinedInput-input": { fontSize: "16px" },
              ".MuiFormLabel-root": { fontSize: "1.6rem" },
            }}
          />
          <TextField
            margin="normal"
            variant="outlined"
            label="Secret"
            value={secret}
            placeholder="This is used to encrypt cookies; make it long and obscure."
            onChange={handleSecretChange}
            fullWidth
            sx={{
              ".MuiOutlinedInput-input": { fontSize: "16px" },
              ".MuiFormLabel-root": { fontSize: "1.6rem" },
            }}
          />
          <hr />
          <Typography
            component="h2"
            variant="h2"
            color="text.primary"
            gutterBottom
            sx={{
              fontSize: "5rem",
            }}
          >
            Admin Config Section
          </Typography>
          <Typography
            variant="p"
            color="text.secondary"
            sx={{
              fontSize: "2rem",
            }}
          >
            <p>
              Copy this into your <code>_config.yml</code>, and restart Hexo.
              Now you'll be protected with a password!
            </p>
          </Typography>
          <AdminYaml username={username} password={password} secret={secret} />
        </Container>
      </Box>
    </div>
  );
}

export default AuthSetup;
