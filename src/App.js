import { Link, Routes, Route, Navigate } from 'react-router-dom';
import Post from './post';
import Posts from './posts';
import Page from './page';
import Pages from './pages';

function App() {
  return (
    <div className="app">
      <div className="app_header">
        <img src="logo.png" className="app_logo" />
        <span className="app_title">Hexo</span>
        <ul className="app_nav">
          <li><Link to="posts">Posts</Link></li>
          <li><Link to="pages">Pages</Link></li>
          <li><Link to="about">About</Link></li>
          <li><Link to="deploy">Deploy</Link></li>
          <li><Link to="settings">Settings</Link></li>
        </ul>
      </div>
      <div className="app_main">
        <Routes>
          <Route exact element={<Posts />} path="/posts" />
          <Route exact element={<Post />} path="/post/:postId" />
          <Route exact element={<Page />} path="/page/:pageId" />
          <Route exact element={<Pages />} path="/pages" />
          <Route exact element={<Navigate to="/posts" />} path="/" />
        </Routes>
      </div>
    </div>
  );
}

export default App;
