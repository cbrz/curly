export const setup = (options={}) => {
  const body = options.body || null;
  const children = options.children || null;
  const date = options.date || Date.parse(0);
  const url = options.url || '/';
  const site = Object.assign({}, {
    production: 'http://prod.com',
    development: 'http://dev.com',
  }, options.site);
  const pages = []; // just a stub object, we'll test this separately.

  return {
    body,
    children,
    date,
    url,
    site,
    pages,
  };
};


export default setup;

