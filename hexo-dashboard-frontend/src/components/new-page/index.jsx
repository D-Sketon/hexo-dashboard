import React, { useState, useRef, useEffect } from 'react';
import api from '../../api';

function NewPage({ onNew }) {  
  const [showing, setShowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('Untitled');
  const inputRef = useRef(null);

  const onShow = () => {
    setShowing(true);
  };

  const onBlur = () => {
    if (showing) {
      onCancel();
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setShowing(false);
    api.newPost(text)
      .then((post) => {
        setText('Untitled');
        onNew(post);
      })
      .catch((err) => {
        console.error('Failed to make a post', err);
      });
  };

  const onCancel = () => {
    setShowing(false);
  };

  const onChange = (e) => {
    setText(e.target.value);
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSubmit(e);
    }
  };

  const focusInput = () => {
    if (showing) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, inputRef.current.value.length);
    }
  };

  // Focus input when showing changes to true
  useEffect(() => {
    focusInput();
  }, [showing]);

  if (!showing) {
    return (
      <div className="new-post" onClick={onShow}>
        <div className="new-post_button">
          <i className="fa fa-plus" /> New Page
        </div>
      </div>
    );
  }

  return (
    <div className="new-post">
      <input
        className="new-post_input"
        ref={inputRef}
        value={text}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        onChange={onChange}
      />
      <i
        className="fa fa-check-circle new-post_ok"
        onMouseDown={onSubmit}
      ></i>
      <i
        className="fa fa-times-circle new-post_cancel"
        onMouseDown={onCancel}
      ></i>
    </div>
  );

}

export default NewPage;