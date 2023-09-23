import React, { useEffect, useState } from 'react';
import api from '../../api';

function SettingsCheckbox(props) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const { name } = props;
    api.settings()
      .then((settings) => {
        const checked = settings.options ? !!settings.options[name] : false;
        setChecked(checked);
      });
  }, []);

  const handleChange = (e) => {
    const { name, enableOptions, disableOptions } = props;
    const addedOptions = e.target.checked ? enableOptions : disableOptions;
    const value = e.target.checked;

    api.setSetting(name, value, addedOptions)
      .then((result) => {
        console.log(result.updated);
        setChecked(result.settings.options[name]);
      });
  };

  return (
    <p style={props.style}>
      <label>
        <input
          checked={checked}
          type="checkbox"
          onChange={handleChange}
          onClick={props.onClick}
        />
        &nbsp; {props.label}
      </label>
    </p>
  );
}

export default SettingsCheckbox;
