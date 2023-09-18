import React, { useState, useEffect, useRef } from 'react';
import { isEqual } from 'lodash-es';
import moment from 'moment';
import AutoList from './auto-list';

const dateFormat = 'MMM D YYYY HH:mm';

function toText(lst, map) {
  return lst.map((name) => map[name] || name);
}

function isMetadataEqual(state, metadata, post) {
  let isEqual = true;
  for (let i = 0; i < metadata.length && isEqual; i++) {
    isEqual = isEqual && state[metadata[i]] === post[metadata[i]];
  }
  return isEqual;
}

function ConfigDropper({ post, tagsCategoriesAndMetadata, onChange }) {
  const [state, setState] = useState({
    open: false,
    date: moment(post.date).format(dateFormat),
    tags: toText(post.tags, tagsCategoriesAndMetadata.tags),
    categories: toText(post.categories, tagsCategoriesAndMetadata.categories),
    author: post.author,
  });

  useEffect(() => {
    setState({
      ...state,
      date: moment(post.date).format(dateFormat),
      tags: toText(post.tags, tagsCategoriesAndMetadata.tags),
      categories: toText(post.categories, tagsCategoriesAndMetadata.categories),
      author: post.author,
    });
    for (let i = 0; i < tagsCategoriesAndMetadata.metadata.length; i++) {
      setState({
        ...state,
        [tagsCategoriesAndMetadata.metadata[i]]: post[tagsCategoriesAndMetadata.metadata[i]]
      });
    };
  }, [post, tagsCategoriesAndMetadata])

  const thisRef = useRef(null);

  const toggleShow = () => {
    if (state.open) {
      save();
    }
    setState({
      ...state,
      open: !state.open,
    });
  };

  const onClose = () => {
    save();
    setState({
      ...state,
      open: false,
    });
  };

  const onChangeDate = (e) => {
    setState({
      ...state,
      date: e.target.value,
    });
  };

  const onChangeAuthor = (e) => {
    setState({
      ...state,
      author: e.target.value,
    });
  };

  const onChangeMetadata = (e) => {
    const newState = {};
    newState[e.target.name] = e.target.value;
    setState({
      ...state,
      ...newState,
    });
  };

  const onChangeAttribute = (attr, value) => {
    const update = {};
    update[attr] = value;
    setState({
      ...state,
      ...update,
    });
  };

  const save = () => {
    let newDate = moment(state.date);
    if (!newDate.isValid()) {
      newDate = moment(post.date);
    }
    const currentTags = toText(post.tags, tagsCategoriesAndMetadata.tags);
    const currentCategories = toText(post.categories, tagsCategoriesAndMetadata.categories);
    const textDate = newDate.toISOString();
    const isSameMetadata = isMetadataEqual(state, tagsCategoriesAndMetadata.metadata, post);
    if (
      textDate === post.date &&
      isEqual(state.categories, currentCategories) &&
      isEqual(state.tags, currentTags) &&
      state.author === post.author &&
      isSameMetadata
    ) {
      return;
    }
    const newState = {
      ...state,
      date: newDate.toISOString(),
      categories: state.categories,
      tags: state.tags,
      author: state.author,
    };
    for (let i = 0; i < tagsCategoriesAndMetadata.metadata.length; i++) {
      newState[tagsCategoriesAndMetadata.metadata[i]] = state[tagsCategoriesAndMetadata.metadata[i]]
    }
    onChange(newState);
  };

  useEffect(() => {
    if (state.open) {
      document.addEventListener('mousedown', globalMouseDown);
    }
    if (!state.open) {
      document.removeEventListener('mousedown', globalMouseDown);
    }
    return () => {
      document.removeEventListener('mousedown', globalMouseDown);
    };
  }, [state.open]);

  const globalMouseDown = (e) => {
    let node = e.target;
    while (node) {
      if (!node.parentNode) return;
      node = node.parentNode;
      if (node === document.body) break;
      if (node === thisRef.current) return;
    }
    onClose();
  };

  const configMetadata = () => {
    return tagsCategoriesAndMetadata.metadata.map((name, index) => {
      const component = Array.isArray(state[name]) ? (
        <AutoList options={[]} values={state[name]} onChange={() => onChangeAttribute(name)} />
      ) : (
        <input
          className="config_metadata"
          value={state[name]}
          name={name}
          onChange={onChangeMetadata}
        />
      );

      return (
        <div key={index} className="config_section">
          <div className="config_section-title">{name}</div>
          {component}
        </div>
      );
    });
  }

  const config = () => {
    return (
      <div className="config">
        <div className="config_section">
          <div className="config_section-title">Date</div>
          <input className="config_date" value={state.date} onChange={onChangeDate} />
        </div>
        <div className="config_section">
          <div className="config_section-title">Author</div>
          <input className="config_author" value={state.author} onChange={onChangeAuthor} />
        </div>
        <div className="config_section">
          <div className="config_section-title">Tags</div>
          <AutoList options={tagsCategoriesAndMetadata.tags} values={state.tags} onChange={() => onChangeAttribute('tags')} />
        </div>
        <div className="config_section">
          <div className="config_section-title">Categories</div>
          <AutoList
            options={tagsCategoriesAndMetadata.categories}
            values={state.categories}
            onChange={() => onChangeAttribute('categories')}
          />
        </div>
        {configMetadata()}
      </div>
    );
  };

  return (
    <div
      ref={thisRef}
      className={`config-dropper ${state.open ? 'config-dropper--open' : ''}`}
      title="Settings"
    >
      <div className="config-dropper_handle" onClick={toggleShow}>
        <i className="fa fa-gear" />
      </div>
      {state.open && config()}
    </div>
  );
}

export default ConfigDropper;