import React, { useState, useEffect } from "react";
import bcrypt from "bcryptjs";

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
    <div className="authSetup">
      <h1>Authentication Setup</h1>
      <p>
        You can secure hexo-admin with a password by adding a section to
        your&nbsp;
        <code>_config.yml</code>. This page is here to easily get it set up.
        Simply fill in the following fields and copy and paste the generated
        text section into your config file.
      </p>
      <div>
        <label>Username:</label>
        <p>The username you'll use to log in.</p>
        <input type="text" onChange={handleUsernameChange} value={username} />
      </div>
      <div>
        <label>Password:</label>
        <p>
          The password you'll use to log in. This will be encrypted to store in
          your config.
        </p>
        <input type="text" onChange={handlePasswordChange} value={password} />
      </div>
      <div>
        <label>Secret:</label>
        <p>This is used to encrypt cookies; make it long and obscure.</p>
        <input type="text" onChange={handleSecretChange} value={secret} />
      </div>
      <h2>Admin Config Section</h2>
      <p>
        Copy this into your <code>_config.yml</code>, and restart Hexo. Now
        you'll be protected with a password!
      </p>
      <AdminYaml username={username} password={password} secret={secret} />
    </div>
  );
}

export default AuthSetup;
