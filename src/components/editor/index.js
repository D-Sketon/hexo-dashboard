import React, { useState, useRef } from 'react';
import path from 'path-browserify';
import cx from 'classnames';
import CodeMirror from './code-mirror';
import SinceWhen from './since-when';
import Rendered from '../rendered';
import CheckGrammar from './check-grammar';
import ConfigDropper from './config-dropper';
import RenameFile from './rename-file';

function Editor({
  isPage,
  post,
  raw,
  updatedRaw,
  onChangeTitle,
  title,
  updated,
  isDraft,
  onPublish,
  onUnpublish,
  onRemove,
  tagsCategoriesAndMetadata,
  adminSettings,
  onChange,
  onChangeContent,
  wordCount,
  rendered,
}) {
  const url = window.location.pathname.split('/');
  const rootPath = url.slice(0, url.indexOf('admin')).join('/');
  const [previewLink, setPreviewLink] = useState(path.join(rootPath, post.path));
  const [checkingGrammar, setCheckingGrammar] = useState(false);
  const renderedRef = useRef(null);

  const handlePreviewLink = (previewLink) => {
    console.log('updating preview link');
    setPreviewLink(path.join(previewLink));
  };

  const handleChangeTitle = (e) => {
    onChangeTitle(e.target.value);
  };

  const handleScroll = (percent) => {
    if (!checkingGrammar) {
      const node = renderedRef.current;
      const height = node.getBoundingClientRect().height;
      node.scrollTop = (node.scrollHeight - height) * percent;
    }
  };

  const onCheckGrammar = () => {
    setCheckingGrammar(!checkingGrammar);
  };

  return (
    <div
      className={cx({
        editor: true,
        'editor--draft': isDraft,
      })}
    >
      <div className="editor_top">
        <input
          className="editor_title"
          value={title}
          onChange={handleChangeTitle}
        />
        {!isPage && (
          <ConfigDropper
            post={post}
            tagsCategoriesAndMetadata={tagsCategoriesAndMetadata}
            onChange={onChange}
          />
        )}
        {!isPage && (isDraft ? (
          <button className="editor_publish" onClick={onPublish}>
            Publish
          </button>
        ) : (
          <button className="editor_unpublish" onClick={onUnpublish}>
            Unpublish
          </button>
        ))}
        {!isPage && (isDraft ? (
          <button className="editor_remove" title="Remove" onClick={onRemove}>
            <i className="fa fa-trash-o" aria-hidden="true" />
          </button>
        ) : (
          <button
            className="editor_remove"
            title="Can't Remove Published Post"
            onClick={onRemove}
            disabled
          >
            <i className="fa fa-trash-o" aria-hidden="true" />
          </button>
        ))}
        {!isPage && (
          <button
            className="editor_checkGrammar"
            title="Check for Writing Improvements"
            onClick={onCheckGrammar}
          >
            <i className="fa fa-check-circle-o" />
          </button>
        )}
      </div>
      <div className="editor_main">
        <div className="editor_edit">
          <div className="editor_md-header">
            {updated && (
              <SinceWhen
                prefix="saved "
                time={updated}
              />
            )}
            <span>
              Markdown&nbsp;&nbsp;
              <RenameFile
                post={post}
                handlePreviewLink={handlePreviewLink}
              />
            </span>
          </div>
          <CodeMirror
            onScroll={handleScroll}
            initialValue={raw}
            onChange={onChangeContent}
            forceLineNumbers={checkingGrammar}
            adminSettings={adminSettings}
          />
        </div>
        <div className="editor_display">
          <div className="editor_display-header">
            <span className="editor_word-count">{wordCount} words</span>
            Preview{' '}
            <a className="editor_perma-link" href={previewLink} target="_blank">
              <i className="fa fa-link" /> {previewLink}
            </a>
          </div>
          {!checkingGrammar && (
            <Rendered
              ref={renderedRef}
              text={rendered}
            />
          )}
          {checkingGrammar && (
            <CheckGrammar toggleGrammar={onCheckGrammar} raw={updatedRaw} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Editor;