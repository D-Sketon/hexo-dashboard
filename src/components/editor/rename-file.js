import React, { useState, useEffect } from 'react';
import path from 'path-browserify';
import api from '../../api';

function RenameFile({ post, handlePreviewLink }) {
  const [filename, setFilename] = useState('');
  const [editing, setEditing] = useState(false);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    const filename = post.source;
    setFilename(filename);
    setEditingName(filename);
  }, [post]);

  const toggleEditing = () => {
    setEditing(!editing);
    setEditingName(filename);
  };

  const handleEditChange = (e) => {
    setEditingName(e.target.value);
  };

  const handleRenameFile = () => {
    const postId = post._id;
    const updatedName = editingName;

    api.renamePost(postId, updatedName).then((result) => {
      if (!result) {
        console.error('Error renaming file.');
        toggleEditing();
        return;
      }

      console.log(`Successfully renamed file to ${updatedName}`);

      const url = window.location.pathname.split('/');
      const rootPath = url.slice(0, url.indexOf('admin')).join('/');
      const previewLink = path.join(rootPath, result.path);

      setFilename(updatedName);
      setEditing(false);
      handlePreviewLink(previewLink);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRenameFile();
    }
    // Escape key
    if (e.keyCode === 27) {
      toggleEditing();
    }
  };

  return (
    <div className="fileRename">
      {!editing && (
        <div
          className="fileRename_display"
          title="Click to rename"
          onClick={toggleEditing}
        >
          {filename}
        </div>
      )}
      {editing && (
        <span>
          <input
            type="text"
            onChange={handleEditChange}
            onKeyDown={handleKeyPress}
            defaultValue={editingName}
          />
          <span className="fileRename_buttons">
            <i
              title="Cancel"
              className="fa fa-times"
              onClick={toggleEditing}
            />
            <i
              title="Rename File"
              className="fa fa-check"
              onClick={handleRenameFile}
            />
          </span>
        </span>
      )}
    </div>
  );
}

export default RenameFile;
