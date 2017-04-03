import constants from '../constants';
import pagemaker from './pagemaker';


export const object = {
  body: null,
  children: [],
  date: constants.DEFAULTS.DATE,
  url: '/',
  pagelimit: constants.DEFAULTS.PAGELIMIT,
  site: constants.DEFAULTS.SITECONFIG.site,
  /*
  get pages() {
    // Only caches once... thinking about this though, might be best as a
    // separate function anyways. Could be confusing since it's not really
    // a member of the object, but derived from object properties
    return pagemaker(this.url, this.pagelimit, this.children);
  },
  */
  childrenAsPages() {
    return pagemaker(this.url, this.pagelimit, this.children);
  },
};


export default object;
