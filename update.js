import path from 'path';
import moment from 'moment';
const merge = require('lodash/fp/merge');
const hfm = require('hexo-front-matter');
const fs = require('hexo-fs');

export default function updateAny(model, id, update, callback, hexo) {
  function removeExtname(str) {
    return str.substring(0, str.length - path.extname(str).length);
  }

  let post = hexo.model(model).get(id);

  if (!post) {
    return callback('Post not found');
  }

  const config = hexo.config;
  const slug = post.slug = hfm.escape(post.slug || post.title, config.filename_case);
  const layout = post.layout = (post.layout || config.default_layout).toLowerCase();
  const date = post.date = post.date ? moment(post.date) : moment();

  const split = hfm.split(post.raw);
  const frontMatter = split.data;
  const compiled = hfm.parse([frontMatter, '---', split.content].join('\n'));

  const preservedKeys = ['title', 'date', 'tags', 'categories', '_content', 'author'];

  for (const key of Object.keys(hexo.config.metadata || {})) {
    preservedKeys.push(key);
  }

  let prevFull = post.full_source;
  let fullSource = prevFull;

  if (update.source && update.source !== post.source) {
    fullSource = hexo.source_dir + update.source;
  }

  for (const attr of preservedKeys) {
    if (attr in update) {
      compiled[attr] = update[attr];
    }
  }

  compiled.date = moment(compiled.date).toDate();

  delete update._content;
  const raw = hfm.stringify(compiled);
  update.raw = raw;
  update.updated = moment();

  if (typeof update.tags !== 'undefined') {
    post.setTags(update.tags);
    delete update.tags;
  }

  if (typeof update.categories !== 'undefined') {
    post.setCategories(update.categories);
    delete update.categories;
  }

  post = merge(post, update);

  post.save(() => {
    fs.writeFile(fullSource, raw, (err) => {
      if (err) return callback(err);

      if (fullSource !== prevFull) {
        fs.unlinkSync(prevFull);
        const assetPrev = removeExtname(prevFull);
        const assetDest = removeExtname(fullSource);

        fs.exists(assetPrev).then((exist) => {
          if (exist) {
            fs.copyDir(assetPrev, assetDest).then(() => {
              fs.rmdir(assetPrev);
            });
          }
        });
      }

      hexo.source.process([post.source]).then(() => {
        callback(null, hexo.model(model).get(id));
      });
    });
  });
}
