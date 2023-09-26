import React from "react";
import { Link } from "react-router-dom";
import SettingsCheckbox from "../components/settings-checkbox";
import SettingsTextbox from "../components/settings-textbox";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

function Settings() {
  const LineNumbers = (
    <SettingsCheckbox
      name="lineNumbers"
      enableOptions={{ editor: { lineNumbers: true } }}
      disableOptions={{ editor: { lineNumbers: false } }}
      label="Enable line numbering."
    />
  );

  const SpellCheck = (
    <SettingsCheckbox
      name="spellcheck"
      enableOptions={{
        editor: { inputStyle: "contenteditable", spellcheck: true },
      }}
      disableOptions={{ editor: { inputStyle: null, spellcheck: false } }}
      label="Enable spellchecking. (buggy on older browsers)"
    />
  );

  const AskImageFilename = (
    <SettingsCheckbox
      name="askImageFilename"
      label="Always ask for filename."
      style={{ width: "300px", display: "inline-block" }}
    />
  );

  const OverwriteImages = (
    <SettingsCheckbox
      name="overwriteImages"
      label="Overwrite images if file already exists."
      style={{ width: "425px", display: "inline-block" }}
    />
  );

  const ImagePath = (
    <SettingsTextbox
      name="imagePath"
      defaultValue="/images"
      label="Image directory"
    />
  );

  const ImagePrefix = (
    <SettingsTextbox
      name="imagePrefix"
      defaultValue="pasted-"
      label="Image filename prefix"
    />
  );

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
            Settings
          </Typography>
          <Typography
            variant="p"
            color="text.secondary"
            sx={{
              fontSize: "2rem",
            }}
          >
            <p>Set various settings for your admin panel and editor.</p>
            <p>
              Hexo dashboard can be secured with a password.{" "}
              <Link to="/auth-setup">Setup authentication here.</Link>
            </p>
          </Typography>

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
            Editor Settings
          </Typography>
          {LineNumbers}
          {SpellCheck}
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
            Image Pasting Settings
          </Typography>
          <Typography
            variant="p"
            color="text.secondary"
            sx={{
              fontSize: "2rem",
            }}
          >
            <p>
              Hexo-dashboard allows you to paste images you copy from the web or
              elsewhere directly into the editor. Decide how you'd like to
              handle the pasted images.
            </p>
          </Typography>

          {AskImageFilename}
          {OverwriteImages}
          {ImagePath}
          {ImagePrefix}
        </Container>
      </Box>
    </div>
  );
}

export default Settings;
