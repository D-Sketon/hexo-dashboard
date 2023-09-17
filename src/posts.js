import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import NewPost from './new-post';
import Rendered from './rendered';
import path from 'path-browserify';
import api from './api';

function Posts() {
  const [data, setData] = useState({
    posts: [],
    selected: 0
  });
  const history = useNavigate();

  useEffect(() => {
    api.posts().then((posts) => {
      const postsAfterProcess = posts.filter((post) => !post.isDiscarded).sort((a, b) => {
        if (a.isDraft !== b.isDraft) return a.isDraft - b.isDraft
        return a.date - b.date
      }).reverse();
      setData({
        ...data,
        posts: postsAfterProcess
      })
    });
  }, []);

  const onNewPost = (post) => {
    setData((prevData) => ({
      ...prevData,
      posts: [post, ...prevData.posts],
    }));
    history(`/post/${post._id}`);
  };

  const goTo = (id, e) => {
    if (e) {
      e.preventDefault();
    }
    history(`/post/${id}`);
  };

  const current = data.posts[data.selected] || {}
  const url = window.location.href.replace(/^.*\/\/[^\/]+/, '').split('/')
  const rootPath = url.slice(0, url.indexOf('admin')).join('/')

  return (
    <>
      {
        data.posts ? <div className="posts">
          <ul className='posts_list'>
            <NewPost onNew={onNewPost} />
            {
              data.posts.map((post, i) =>
                <li key={post._id} className={cx({
                  "posts_post": true,
                  "posts_post--draft": post.isDraft,
                  "posts_post--selected": i === data.selected
                })}
                  onDoubleClick={() => goTo(post._id)}
                  onClick={() => setData({
                    ...data,
                    selected: i,
                  })}
                >
                  <span className="posts_post-title">
                    {post.title}
                  </span>
                  <span className="posts_post-date">
                    {moment(post.date).format('MMM Do YYYY')}
                  </span>
                  <a className='posts_perma-link' target="_blank" href={path.join(rootPath, '/', post.path)}>
                    <i className='fa fa-link' />
                  </a>
                  <Link className='posts_edit-link' to={`/post/${post._id}`}>
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

export default Posts;