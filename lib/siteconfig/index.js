import fs from 'fs-promise';
import path from 'path';
import yaml from 'js-yaml';
import constants from '../constants';


// return siteconfig object
export const siteconfig = {
  parse: (sitepath, file) => parse(sitepath, file),
};

// parse a site directory and config file
export const parse = (sitepath, file) => {
  const yamlString = fs.readFileSync(file, 'utf8');
  const config = yaml.safeLoad(yamlString);

  config.site.urlroot = process.env.NODE_ENV === 'production'?
    config.site.production : config.site.development;

  const appendToPath = (...dir) => path.join(sitepath, ...dir);
  const dir = {
    content: appendToPath(constants.DIR.CONTENT),
    layouts: appendToPath(constants.DIR.LAYOUTS),
    publish: appendToPath(constants.DIR.PUBLISH),
  };
  config.dir = dir;

  return config;
};


export default siteconfig;
