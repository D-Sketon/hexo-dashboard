import serveStatic from 'serve-static';
import bodyParser from 'body-parser';
import path from 'path';
import setupAuthentication from './auth';
import api from './api';

let passwordProtected = hexo.config.admin && hexo.config.admin.username;

// Verify that correct config options are set.
if (passwordProtected) {
  if (!hexo.config.admin.password_hash) {
    console.error('[Hexo Admin]: config admin.password_hash is required for authentication');
    passwordProtected = false;
  } else if (hexo.config.admin.password_hash.length <= 32) {
    throw new Error('[Hexo Admin]: the provided password_hash looks like an md5 hash -- hexo-admin has switched to use bcrypt; see the Readme for more info.');
  }

  if (!hexo.config.admin.secret) {
    console.error('[Hexo Admin]: config admin.secret is required for authentication');
    passwordProtected = false;
  }
}

hexo.extend.filter.register('server_middleware', (app) => {
  if (passwordProtected) {
    setupAuthentication(app, hexo); // setup authentication, login page, etc.
  }

  // Main routes
  app.use(`${hexo.config.root}admin/`, serveStatic(path.join(__dirname, 'www')));
  app.use(`${hexo.config.root}admin/api/`, bodyParser.json({ limit: '50mb' }));

  // Setup the JSON API endpoints
  api(app, hexo);
});