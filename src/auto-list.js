import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';

const AutoList = ({ values, onChange }) => {
  const [selected, setSelected] = useState(null);
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (selected !== null) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [selected]);

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleEdit = (i, e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    setSelected(i);
    setText(values[i] || '');
  };

  const handleBlur = () => {
    const updatedValues = [...values];

    if (values.indexOf(text) === -1) {
      if (selected >= updatedValues.length) {
        if (text) {
          updatedValues.push(text);
        }
      } else {
        updatedValues[selected] = text;
      }
    }

    setSelected(null);
    setText('');
    onChange(updatedValues);
  };

  const handleRemove = (i) => {
    const updatedValues = [...values];

    if (i >= updatedValues.length) return;
    updatedValues.splice(i, 1);

    if (selected !== null && i < selected) {
      setSelected(selected - 1);
    }

    onChange(updatedValues);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!text) return;
      addAfter();
    }
  };

  const addAfter = () => {
    if (values.indexOf(text) !== -1) {
      return;
    }

    const updatedValues = [...values];

    if (selected === updatedValues.length) {
      updatedValues.push(text);
      onChange(updatedValues);
      setSelected(updatedValues.length);
    } else {
      updatedValues[selected] = text;
      updatedValues.splice(selected + 1, 0, '');
      onChange(updatedValues);
      setSelected(selected + 1);
    }

    setText('');
  };

  const renderAutoListItems = () => {
    const items = values.concat('Add new');

    return items.map((item, i) => (
      <div key={item} className="autolist_item">
        {i === selected ? (
          <input
            ref={inputRef}
            className="autolist_input"
            value={text}
            onBlur={handleBlur}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <div
            className={classNames({
              autolist_show: true,
              'autolist_show--new': i === items.length - 1,
            })}
            onMouseDown={(e) => handleEdit(i, e)}
          >
            {item}
          </div>
        )}
        {i < items.length - 1 && (
          <i
            className="autolist_del fa fa-times"
            onClick={() => handleRemove(i)}
          />
        )}
      </div>
    ));
  };

  return <div className="autolist">{renderAutoListItems()}</div>;
};

export default AutoList;
