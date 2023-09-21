import React, { useEffect, useState } from 'react';
import api from '../api';

function SettingsTextbox(props) {
  const [value, setValue] = useState(props.defaultValue);

  useEffect(() => {
    const { name, defaultValue } = props;
    api.settings()
      .then((settings) => {
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

    api.setSetting(name, newValue)
      .then((result) => {
        console.log(result.updated);
        setValue(result.settings.options[name]);
      });
  };

  return (
    <p>
      <b>{props.label}:  </b>
      <input
        type="text"
        onChange={handleChange}
        value={value}
      />
    </p>
  );
}

export default SettingsTextbox;
