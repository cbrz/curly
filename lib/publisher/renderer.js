import fs from 'fs-promise';
import path from 'path';

import {DEFAULTS, DIR, EXT} from '../constants';
import handlebarsSetup from '../setup/handlebars-setup';
import markdownItSetup from '../setup/markdown-it-setup';
import * as readdir from '../helpers/readdir-recursive';


// TODO: research why seeing error when placing inside setup()...
const markdownItInstance = markdownItSetup();


// return renderer instance
export const setup = (siteconfig, _handlebars, _markdownIt) => {
  const theme = siteconfig.render.theme || DEFAULTS.LAYOUT;
  const dirs = {
    layout: path.join(siteconfig.dir.layouts, theme),
    partials: path.join(
        siteconfig.dir.layouts, theme, DIR.HANDLEBARS.PARTIALS),
    templates: path.join(
        siteconfig.dir.layouts, theme, DIR.HANDLEBARS.TEMPLATES),
  };

  const handlebars = _handlebars || handlebarsSetup();
  const markdownIt = _markdownIt || markdownItInstance;
  registerPartials(handlebars, dirs.partials);

  const templates = compileTemplates(handlebars, dirs.templates);

  return {
    render: (data) => render(markdownIt, templates, data),
    _hbs: handlebars,
  };
};


// returns rendered html
export const render = (markdownIt, templates, data) => {
  const urlToHbsKey = (url) => {
    const hbskey = url
      .replace(/\//g, '_')
      .replace(/^_/, '')
      .replace(/_$/, '');
    return hbskey;
  };
  const templateName = urlToHbsKey(data.url);

  const renderData = Object.assign({}, data, {
    body: data.body ? markdownIt.render(data.body) : null,
  });

  if (templates.hasOwnProperty(templateName))
    return templates[templateName](renderData);
  return templates[DEFAULTS.TEMPLATENAME](renderData);
};


// returns template object for use with render
export const compileTemplates = (hbs, templatedir) => {
  const templates = {};
  readdir.sync(templatedir)
    .filter((f) => {
      if (isHandlebarsFile(f))
        return f;
    }).forEach((f) => {
      const name = pathToHbsKey(f, templatedir);
      templates[name] = hbs.compile(fs.readFileSync(f, 'utf8'));
    });

  return templates;
};


// returns a string to use as an hbs key
export const pathToHbsKey = (filepath, stripdir) => {
  const pathobject = path.parse(filepath);

  return path.join(pathobject.dir, pathobject.name)
    .replace(stripdir, '')
    .replace(/^[\\|\/]+/, '')
    .replace(path.sep, '_');
};


// calls registerPartial on each partial
export const registerPartials = (hbs, partialdir) => {
  readdir.sync(partialdir)
    .filter((f) => {
      if (isHandlebarsFile(f))
        return f;
    }).forEach((f) => {
      const name = pathToHbsKey(f, partialdir);
      hbs.registerPartial(name, fs.readFileSync(f, 'utf8'));
    });
};


const isHandlebarsFile = (file) => {
  try {
    return fs.statSync(file).isFile()
      && path.parse(file).ext == EXT.HANDLEBARS;
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
};


export default setup;
