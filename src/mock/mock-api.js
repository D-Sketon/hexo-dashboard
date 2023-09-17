import moment from 'moment';
import render from './render';
import deepAssign from 'deep-assign';

function newId() {
  let id = '';
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 10; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function newPost(title) {
  const slug = title.toLowerCase().replace(/ /g, '-');
  return {
    _id: newId(),
    title: title,
    tags: [],
    categories: [],
    date: new Date().toISOString(),
    content: '',
    source: `_drafts/${slug}.md`,
    raw: `title: ${title}\n---`,
    slug: slug,
    updated: new Date().toISOString(),
    excerpt: '',
    layout: 'post',
    isDraft: true,
    isDiscarded: false,
    path: `${moment().format('YYYY/MM/DD/')}${slug}/`,
  };
}

export default function createAPI(config) {
  const ids = {};
  config.posts.forEach((post) => (ids[post._id] = post));
  return {
    posts: () => Promise.resolve(config.posts),
    post: (id, data) => {
      if (data) {
        for (const name in data) {
          ids[id][name] = data[name];
        }
        if (data._content) {
          ids[id].content = render({ text: data._content });
        }
        return Promise.resolve({ post: ids[id], tagsAndCategories: config.tagsAndCategories });
      }
      return Promise.resolve(ids[id]);
    },

    newPost: (title) => {
      const post = newPost(title);
      ids[post._id] = post;
      config.posts.push(post);
      return Promise.resolve(post);
    },
    uploadImage: (data) => Promise.resolve(null),
    remove: (id) => Promise.resolve(null),
    publish: (id) => {
      ids[id].isDraft = false;
      return Promise.resolve(ids[id]);
    },
    unpublish: (id) => {
      ids[id].isDraft = true;
      return Promise.resolve(ids[id]);
    },
    renamePost: (id, filename) => Promise.resolve({ path: filename }),
    tagsCategoriesAndMetadata: () => Promise.resolve(config.tagsAndCategories),
    settings: () => Promise.resolve(config.settings),
    setSetting: (name, value, addedOptions) => {
      console.log(config.settings);
      if (!config.settings.options) {
        config.settings.options = {};
      }
      config.settings.options[name] = value;
      config.settings = deepAssign(config.settings, addedOptions);
      return Promise.resolve({
        updated: `Successfully updated ${name} = ${value}`,
        settings: config.settings,
      });
    },
  };
}
