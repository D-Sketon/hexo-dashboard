import rest from './rest';

const types = {
  rest,
}

const mod = {
  init: (type, config) => {
    if ('string' === typeof type) {
      type = types[type]
    }
    const api = type(config)
    for (const name in api) {
      mod[name] = api[name]
    }
  }
};

export default mod;
