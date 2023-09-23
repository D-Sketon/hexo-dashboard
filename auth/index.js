import cookieParser from 'cookie-parser';
import serveStatic from 'serve-static';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';

const auth = require('connect-auth');
import authStrategy from './strategy';

export default function setupAuthentication(app, hexo) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: hexo.config.admin.secret,
    })
  );
  app.use(hexo.config.root + 'admin', auth(new authStrategy(hexo)));
  app.use(hexo.config.root + 'admin/login', (req, res) => {
    if (req.method === 'POST') {
      req.authenticate(['adminAuth'], (error, done) => {
        if (done) {
          res.writeHead(302, { Location: hexo.config.root + 'admin/' });
          res.end();
        }
      });
    } else {
      serveStatic(path.join(__dirname, '../www', 'login'))(req, res);
    }
  });
  app.use(hexo.config.root + 'admin/', (req, res, next) => {
    req.authenticate(['adminAuth'], next);
  });
}
