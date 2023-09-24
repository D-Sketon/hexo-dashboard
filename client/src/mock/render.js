
import { marked } from 'marked'

marked.setOptions({
  langPrefix: '',
});

export default function (data, options) {
  return marked(data.text, {
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
    ...options,
  });
};

