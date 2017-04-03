import fs from 'fs-promise';
import path from 'path';

import {DEFAULTS, DIR, FILE} from '../constants';
import logger from '../helpers/log';
import rendererSetup from './renderer';


const log = logger();


export const publisher = (siteconfig, _renderer) => {
  const renderer = _renderer || rendererSetup(siteconfig);
  return {
    publish: (data) => {
      return publish(siteconfig, renderer.render, build, data);
    },
    publishPublic: () => {
      return publishPublic(siteconfig);
    },
  };
};


// create files/folders in publish directory for both index and content
export const publish = async (siteconfig, render, build, data) => {
  if (data.children.length !== 0)
    await publishIndex(siteconfig, render, build, data);
  else
    await publishFile(siteconfig, render, build, data);
};


// create files/folders in publish directory for index and page content
export const publishIndex = async (siteconfig, render, build, data) => {
  data.childrenAsPages().forEach(async (page) => {
    const pageData = Object.assign({}, data, page);
    const file = generatePublishpath(siteconfig, pageData.url);
    const html = render(pageData);
    log.debug(
        'publisher.publishIndex: file=[%s], pageData=[%s], html=[%s]',
        file,
        pageData,
        html);
    await build(file, html);
  });
};


// create files/folders in publish directory for individual content
export const publishFile = async (siteconfig, render, build, data) => {
  const file = generatePublishpath(siteconfig, data.url);
  const html = render(data);
    log.debug(
        'publisher.publishFile: file=[%s], data=[%s], html=[%s]',
        file,
        data,
        html);
  await build(file, html);
};


// copy public directory from layouts/theme to publish
export const publishPublic = async (siteconfig) => {
  const theme = siteconfig.render.theme || DEFAULTS.LAYOUT;
  const publicdir = path.join(siteconfig.dir.layouts, theme, DIR.PUBLIC);

  const publishdir = siteconfig.dir.publish;
  const publicfiles = await fs.readdir(publicdir);

  await Promise.all(publicfiles.map(async (file) => {
    const publicfile = path.join(publicdir, file);
    const publishfile = path.join(publishdir, file);
    try {
      log.debug(
          'publisher.publishPublic: from=[%s] to=[%s]',
          publicfile,
          publishfile);
      await fs.copy(publicfile, publishfile);
    } catch(err) {
      log.error('publisher.publishPublic: %s', err);
    }
  }));
};


// create folder and file
export const build = async (file, content) => {
  try {
    const pathobject = path.parse(file);
    await fs.mkdirs(pathobject.dir);
    log.debug(
        'publisher.index.build: action=[%s], directory=[%s]',
        fs.mkdirs.name,
        pathobject.dir);

    await fs.writeFile(file, content);
    log.debug(
        'publisher.index.build: action=[%s], file=[%s]',
        fs.writeFile.name,
        file);
  } catch(err) {
    throw err;
  }
};


// destroy file (if present), then folder
export const destroy = async (file) => {
  try {
    const dir = path.parse(file).dir;
    await fs.emptyDir(dir);
    log.debug(
        'publisher.index.destroy: action=[%s], directory=[%s]',
        fs.emptyDir.name,
        dir);
  } catch(err) {
    throw err;
  }
};


const generatePublishpath = (siteconfig, url) => {
  const urlpath = url.replace('/', path.sep);
  return path.join(siteconfig.dir.publish, urlpath, FILE.PUBLISHER.INDEX);
};


export default publisher;

