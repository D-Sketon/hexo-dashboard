import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'
import App from './app';
import api from './api';
import './style/index.less';

const url = window.location.href.replace(/^.*\/\/[^\/]+/, '').split('/');
const rootPath = url.slice(0, url.indexOf('admin')).join('/');
api.init('rest', rootPath + '/admin/api');

document.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  );
});

// import mock from './mock/mock-api';
// import posts from './mock/posts';
// import tagsAndCategories from './mock/tags-and-categories';
// import settings from './mock/settings';

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { HashRouter } from 'react-router-dom'
// import App from './app';
// import api from './api';
// import './style/index.less';

// api.init(mock, {
//   posts,
//   tagsAndCategories,
//   settings
// })

// document.addEventListener('DOMContentLoaded', () => {
//   const root = ReactDOM.createRoot(document.getElementById('root'));
//   root.render(
//     <HashRouter>
//       <App />
//     </HashRouter>
//   );
// });
