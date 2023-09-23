import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import api from '../api';
import Editor from '../components/editor';
import { debounce } from 'lodash-es';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import Confirm from '../components/confirm';
import { marked } from 'marked';

const confirm = (message, options = {}) => {
  options = {
    ...options,
    message,
  }
  return new Promise((resolve, reject) => {
    const wrapper = document.body.appendChild(document.createElement('div'));
    const handleConfirm = () => {
      ReactDOM.unmountComponentAtNode(wrapper);
      setTimeout(() => {
        wrapper.remove();
      });
      resolve();
    };

    const handleAbort = () => {
      ReactDOM.unmountComponentAtNode(wrapper);
      setTimeout(() => {
        wrapper.remove();
      });
      reject();
    };

    const confirmComponent = (
      <Confirm
        confirm={handleConfirm}
        abort={handleAbort}
        {...options}
      />
    );

    ReactDOM.render(confirmComponent, wrapper);
  })
}

function Post() {
  const params = useParams()
  const [data, setData] = useState({
    updated: moment(),
    post: null,
    settings: null,
    tagsCategoriesAndMetadata: null,
  })

  const history = useNavigate();

  useEffect(() => {
    const items = {
      post: api.post(params.postId),
      settings: api.settings(),
      tagsCategoriesAndMetadata: api.tagsCategoriesAndMetadata(),
    }
    Object.keys(items).forEach((name) => {
      Promise.resolve(items[name]).then((d) => {
        setData((data) => (
          {
            ...data,
            [name]: d
          }
        ));
        dataDidLoad(name, d);
      })
    })
  }, [params.postId]);

  const updatePost = useCallback(debounce((update) => {
    const now = moment();
    api.post(params.postId, update).then(() => {
      setData((data) => (
        {
          ...data,
          updated: now,
        }
      ));
    });
  }, 1000, { trailing: true, loading: true }), []);

  const dataDidLoad = (name, d) => {
    if (name !== 'post') return;
    const parts = d.raw.split('---');
    const sliceIndex = parts[0] === '' ? 2 : 1;
    const rawContent = parts.slice(sliceIndex).join('---').trim();
    setData((data) => (
      {
        ...data,
        title: d.title,
        initialRaw: rawContent,
        raw: rawContent,
        rendered: d.content
      }
    ))
  }

  const handleChange = (update) => {
    const now = moment()
    api.post(this.props.params.postId, update).then((d) => {
      const state = {
        tagsCategoriesAndMetadata: d.tagsCategoriesAndMetadata,
        post: d.post,
        updated: now,
        author: d.post.author,
      }
      for (let i = 0; i < d.tagsCategoriesAndMetadata.metadata.length; i++) {
        const name = d.tagsCategoriesAndMetadata.metadata[i]
        state[name] = d.post[name]
      }
      setData({
        ...data,
        ...state,
      })
    })
  }

  const handleContentChange = (text) => {
    if (text === data.raw) return;
    setData({
      ...data,
      raw: text,
      updated: null,
      rendered: marked(text),
    });
    updatePost({ _content: text });
  };

  const handleTitleChange = (newTitle) => {
    if (newTitle === data.title) return;
    setData({
      ...data,
      title: newTitle,
    });
    updatePost({ title: newTitle });
  };

  const handlePublish = () => {
    if (!data.post.isDraft) return;
    api.publish(data.post._id).then((updatedPost) => {
      setData({
        ...data,
        post: updatedPost,
      })
    });
  };

  const handleUnpublish = () => {
    if (data.post.isDraft) return;
    api.unpublish(data.post._id).then((updatedPost) => {
      setData({
        ...data,
        post: updatedPost,
      })
    });
  };

  const handleRemove = () => {
    return confirm('Delete this post?', {
      description: 'This operation will move current draft into source/_discarded folder.',
      confirmLabel: 'Yes',
      abortLabel: 'No'
    }).then(() => {
      api.remove(data.post._id).then(() => {
        history('posts')
      });
    });
  }

  if (!data.post || !data.tagsCategoriesAndMetadata || !data.settings) {
    return <span>Loading...</span>;
  }

  return (
    <Editor
      isPage={false}
      post={data.post}
      raw={data.initialRaw}
      updatedRaw={data.raw}
      wordCount={data.raw ? data.raw.split(' ').length : 0}
      isDraft={data.post.isDraft}
      updated={data.updated}
      title={data.title}
      rendered={data.rendered}
      onChange={handleChange}
      onChangeContent={handleContentChange}
      onChangeTitle={handleTitleChange}
      onPublish={handlePublish}
      onUnpublish={handleUnpublish}
      onRemove={handleRemove}
      tagsCategoriesAndMetadata={data.tagsCategoriesAndMetadata}
      adminSettings={data.settings}
    />
  );
}

export default Post;