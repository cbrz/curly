import fm from 'front-matter';
import fs from 'fs-promise';
import path from 'path';

import constants from '../constants';
import urljoin from '../helpers/urljoin';
import object from './object';


// object responsible for creating new content objects
export const factory = (siteconfig) => {
  let _siteconfig = siteconfig || constants.DEFAULTS.SITECONFIG;
  return {
    create: (url) => create(_siteconfig, url),
    parse: (file) => parse(_siteconfig, file),
    set: (siteconfig) => {
      _siteconfig = siteconfig;
    },
  };
};


// create new content objects with url attached
export const create = async (siteconfig, relativeUrl) => {
  return Object.assign({}, object, {
    url: relativeUrl || constants.DEFAULTS.URL,
    pagelimit: siteconfig.render.pagelimit || constants.DEFAULTS.PAGELIMIT,
    site: Object.assign({}, siteconfig.site, {
      urlroot: generateUrlroot(siteconfig),
    }),
  });
};


// parse markdown file and create new content file
export const parse = async (siteconfig, filepath) => {
  try {
    const filecontent = await fs.readFile(filepath, 'utf8');
    const fstat = fs.statSync(filepath);
    const fileFm = fm(filecontent);

    const relativeUrl = generateUrlFromFile(siteconfig, filepath);
    const content = await create(siteconfig, relativeUrl);
    return Object.assign({}, content, {
      body: fileFm.body,
      date: fstat.mtime,
    }, fileFm.attributes);
  } catch (err) {
    throw err;
  }
};


// generate urlroot
const generateUrlroot = (siteconfig) => {
  const urlroot = process.env.NODE_ENV === 'production' ?
    siteconfig.site.production :
    siteconfig.site.development;

  return urlroot;
};


// generate relative url based on file position
const generateUrlFromFile = (siteconfig, filepath) => {
  const pathobject = path.parse(filepath);
  const relativedir = pathobject.dir.replace(siteconfig.dir.content, '');

  if (pathobject.base === constants.FILE.CONTENT.INDEX)
    return urljoin(relativedir.split(path.separator));
  return urljoin(relativedir.split(path.separator), pathobject.name);
};


export default factory;
