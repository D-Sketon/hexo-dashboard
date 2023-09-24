import { Link, Routes, Route, Navigate } from 'react-router-dom';
import Post from './pages/post';
import Posts from './pages/posts';
import Page from './pages/page';
import Pages from './pages/pages';
import About from './pages/about';
import Deploy from './pages/deploy';
import Settings from './pages/settings';
import AuthSetup from './pages/auth-setup';
import ResponsiveAppBar from './components/responsive-app-bar';

function App() {
  return (
    <div className="app">
      <ResponsiveAppBar />
      <div className="app_main">
        <Routes>
          <Route exact element={<Posts />} path="/posts" />
          <Route exact element={<Post />} path="/post/:postId" />
          <Route exact element={<Page />} path="/page/:pageId" />
          <Route exact element={<Pages />} path="/pages" />
          <Route exact element={<About />} path="/about" />
          <Route exact element={<Deploy />} path="/deploy" />
          <Route exact element={<Settings />} path="/settings" />
          <Route exact element={<AuthSetup />} path="/auth-setup" />
          <Route exact element={<Navigate to="/posts" />} path="/" />
        </Routes>
      </div>
    </div>
  );
}

export default App;
