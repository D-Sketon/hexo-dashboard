import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import NewPage from './new-page';
import Rendered from './components/rendered';
import path from 'path-browserify';
import api from './api';

function Pages() {
  const [data, setData] = useState({
    pages: [],
    selected: 0
  });
  const history = useNavigate();

  useEffect(() => {
    api.pages().then((pages) => {
      const pagesAfterProcess = pages.sort((a, b) => {
        if (a.isDraft !== b.isDraft) return a.isDraft - b.isDraft
        return a.date - b.date
      }).reverse();
      setData({
        ...data,
        pages: pagesAfterProcess
      })
    });
  }, []);

  const onNewPage = (page) => {
    setData((prevData) => ({
      ...prevData,
      pages: [page, ...prevData.pages],
    }));
    history(`/page/${page._id}`);
  };

  const goTo = (id, e) => {
    if (e) {
      e.preventDefault();
    }
    history(`/page/${id}`);
  };

  const current = data.pages[data.selected] || {}
  const url = window.location.href.replace(/^.*\/\/[^\/]+/, '').split('/')
  const rootPath = url.slice(0, url.indexOf('admin')).join('/')

  return (
    <>
      {
        data.pages ? <div className="posts">
          <ul className='posts_list'>
            <NewPage onNew={onNewPage} />
            {
              data.pages.map((page, i) =>
                <li key={page._id} className={cx({
                  "posts_post": true,
                  "posts_post--draft": page.isDraft,
                  "posts_post--selected": i === data.selected
                })}
                  onDoubleClick={goTo(page._id)}
                  onClick={() => setData({
                    ...data,
                    selected: i,
                  })}
                >
                  <span className="posts_post-title">
                    {page.title}
                  </span>
                  <span className="posts_post-date">
                    {moment(page.date).format('MMM Do YYYY')}
                  </span>
                  <a className='posts_perma-link' target="_blank" href={path.join(rootPath, '/', page.path)}>
                    <i className='fa fa-link' />
                  </a>
                  <Link className='posts_edit-link' to="page" pageId={page._id}>
                    <i className='fa fa-pencil' />
                  </Link>
                </li>
              )
            }
          </ul>
          <div className={cx({
            'posts_display': true,
            'posts_display--draft': current.isDraft
          })}>
            {current.isDraft && <div className="posts_draft-message">Draft</div>}
            <Rendered
              className="posts_content"
              text={current.content} />
          </div>
        </div> : <div className='posts'>Loading...</div>
      }
    </>
  )
}

export default Pages;