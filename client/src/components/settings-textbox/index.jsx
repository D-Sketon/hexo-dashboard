import React, { useEffect, useState } from "react";
import api from "../../api";

import TextField from "@mui/material/TextField";

function SettingsTextbox(props) {
  const [value, setValue] = useState(props.defaultValue);

  useEffect(() => {
    const { name, defaultValue } = props;
    api.settings().then((settings) => {
      let newValue = defaultValue;

      if (settings.options) {
        newValue = settings.options[name] || defaultValue;
      }

      setValue(newValue);
    });
  }, []);

  const handleChange = (e) => {
    const { name } = props;
    const newValue = e.target.value;

    api.setSetting(name, newValue).then((result) => {
      console.log(result.updated);
      setValue(result.settings.options[name]);
    });
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <TextField
        label={props.label}
        variant="outlined"
        value={value}
        onChange={handleChange}
        fullWidth 
        sx={{
          ".MuiOutlinedInput-input": { fontSize: "16px" },
          ".MuiFormLabel-root": { fontSize: "1.6rem" },
        }}
      />
    </div>
  );
}

export default SettingsTextbox;
