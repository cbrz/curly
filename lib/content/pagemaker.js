import constants from '../constants';
import urljoin from '../helpers/urljoin';


// returns an array of children parsed into page information
//
// Note: There may be a possibility it might make more sense to attach the
// parent onto the pages, would require a parameter signature change so
// going to assume it's not needed for now.
export const pagemaker = (url, pagelimit, children) => {
  const _pagelimit = pagelimit || constants.DEFAULTS.PAGELIMIT;
  const max = Math.ceil(children.length / _pagelimit);

  // clone array or it will really splice it.
  const pagechildren = children.slice();

  return Array.apply(null, Array(max)) // eslint-disable-line prefer-spread
    .map((page, index) => {
      const current = index + 1;
      return {
        page: {
          current,
          max,
          next: current !== max ? current+1 : null,
          nexturl: current !== max ?
            generateUrl(url, current+1) :
            null,
          previous: current !== 1 ? current-1 : null,
          previousurl: current !== 1 ?
            generateUrl(url, current-1) :
            null,
        },
        children: pagechildren.splice(0, _pagelimit),
        url: generateUrl(url, current),
      };
    });
};


const generateUrl = (url, pagenumber) => {
  if (pagenumber > 1) {
    return urljoin(
        url.replace(/\/$/, ''),
        constants.FILE.PUBLISHER.PAGE, pagenumber.toString());
  }
  return url;
};


export default pagemaker;
