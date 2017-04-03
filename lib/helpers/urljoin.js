export const urljoin = (...path) => {
  const url = ('/' + Array.prototype.join.call(path, '/') + '/')
    .replace(/\/+/g, '/');
  return url;
};


export default urljoin;
