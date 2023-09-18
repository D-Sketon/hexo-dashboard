import React, { useState, useEffect, useCallback } from 'react';
import api from './api';
import Editor from './editor';
import { debounce } from 'lodash-es';
import moment from 'moment';
import { marked } from 'marked';
import { useParams } from 'react-router-dom';

function Page() {
  const params = useParams()
  const [data, setData] = useState({
    updated: moment(),
    page: null,
    settings: null,
  })

  useEffect(() => {
    const items = {
      page: api.page(params.pageId),
      settings: api.settings(),
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
  }, [params.pageId]);

  const updatePage = useCallback(debounce((update) => {
    const now = moment();
    api.page(params.pageId, update).then(() => {
      setData((data) => (
        {
          ...data,
          updated: now,
        }
      ));
    });
  }, 1000, { trailing: true, loading: true }), []);

  const dataDidLoad = (name, d) => {
    if (name !== 'page') return;
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
    api.page(this.props.params.pageId, update).then((d) => {
      setData({
        ...data,
        page: d.page,
        updated: now,
      });
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
    updatePage({ _content: text });
  };

  const handleTitleChange = (newTitle) => {
    if (newTitle === data.title) return;
    setData({
      ...data,
      title: newTitle,
    });
    updatePage({ title: newTitle });
  };

  const handlePublish = () => {
    if (!data.page.isDraft) return;
    api.publish(data.page._id).then((updatedPage) => {
      setData({
        ...data,
        page: updatedPage,
      })
    });
  };

  const handleUnpublish = () => {
    if (data.page.isDraft) return;
    api.unpublish(data.page._id).then((updatedPage) => {
      setData({
        ...data,
        page: updatedPage,
      })
    });
  };

  if (!data.page || !data.settings) {
    return <span>Loading...</span>;
  }

  return (
    <Editor
      isPage={true}
      post={data.page}
      raw={data.initialRaw}
      wordCount={data.raw ? data.raw.split(' ').length : 0}
      isDraft={data.page.isDraft}
      updated={data.updated}
      title={data.title}
      rendered={data.rendered}
      onChange={handleChange}
      onChangeContent={handleContentChange}
      onChangeTitle={handleTitleChange}
      onPublish={handlePublish}
      onUnpublish={handleUnpublish}
      tagsCategoriesAndMetadata={data.tagsCategoriesAndMetadata}
      adminSettings={data.settings}
    />
  );
}

export default Page;