export const setup = (options={}) => {
  const dir = Object.assign({}, {
    content: '/path/to/dir/content',
    layouts: '/path/to/dir/layouts',
    publish: '/path/to/dir/publish',
  }, options.dir);

  const render = Object.assign({}, {pagelimit: 1}, options.render);

  const site = Object.assign({}, {
    production: 'http://prod.com',
    development: 'http://dev.com',
  }, options.site);

  return {dir, render, site};
};


export default setup;
