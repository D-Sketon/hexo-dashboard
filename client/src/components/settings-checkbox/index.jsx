import React, { useEffect, useState } from "react";
import api from "../../api";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";

function SettingsCheckbox(props) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const { name } = props;
    api.settings().then((settings) => {
      const checked = settings.options ? !!settings.options[name] : false;
      setChecked(checked);
    });
  }, []);

  const handleChange = (e) => {
    const { name, enableOptions, disableOptions } = props;
    const addedOptions = e.target.checked ? enableOptions : disableOptions;
    const value = e.target.checked;

    api.setSetting(name, value, addedOptions).then((result) => {
      console.log(result.updated);
      setChecked(result.settings.options[name]);
    });
  };

  return (
    <div style={props.style}>
      <Typography variant="h3" color="text.secondary" paragraph>
        <FormControlLabel
          sx={{ ".MuiFormControlLabel-label": { fontSize: "2rem" } }}
          control={
            <Checkbox
              checked={checked}
              onChange={handleChange}
              onClick={props.onClick}
              sx={{ "& .MuiSvgIcon-root": { fontSize: "2rem" } }}
            />
          }
          label={props.label}
        />
      </Typography>
    </div>
  );
}

export default SettingsCheckbox;
