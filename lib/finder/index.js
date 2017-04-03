import fs from 'fs-promise';
import path from 'path';

import {EXT, FILE} from '../constants';
import readdirRecursive from '../helpers/readdir-recursive';


// find files
export const find = async (dir, callback) => {
  const files = (await readdirRecursive(dir))
    .filter(isContent);

  if (callback && typeof callback === 'function')
    return await callback(files);

  return files;
};


// find index files
export const findIndexFiles = async (dir, ignoredirs, callback) => {
  if (!ignoredirs)
    ignoredirs = [];

  ignoredirs = ignoredirs.map((dir) => {
    return dir.replace(/\/$/, '');
  });

  const files = await find(dir, (data) => {
    return data
      .sort((fileA, fileB) => {
        return fs.statSync(fileB).mtime - fs.statSync(fileA).mtime;
      }).filter((f) => {
        const filedir = path.parse(f).dir;
        if (ignoredirs.indexOf(filedir) !== -1)
          return false;
        return true;
      }).filter((f) => {
        if (isIndexFile(f))
          return true;
      });
  });

  if (callback !== 'undefined' && typeof callback === 'function')
    return callback(files);

  return files;
};


// find files
export const findFiles = async (dir, ignoredirs, callback) => {
  if (!ignoredirs)
    ignoredirs = [];

  ignoredirs = ignoredirs.map((dir) => {
    return dir.replace(/\/$/, '');
  });

  const files = await find(dir, (data) => {
    return data
      .sort((fileA, fileB) => {
        return fs.statSync(fileB).mtime - fs.statSync(fileA).mtime;
      }).filter((f) => {
        const filedir = path.parse(f).dir;
        if (ignoredirs.indexOf(filedir) !== -1)
          return false;
        return true;
      }).filter((f) => {
      if (!isIndexFile(f))
        return true;
    });
  });

  if (callback !== 'undefined' && typeof callback === 'function')
    return callback(files);

  return files;
};


const isContent = (filepath) => {
  return isFile(filepath) && isMarkdownFile(filepath);
};


const isFile = (filepath) => fs.statSync(filepath).isFile();


const isIndexFile = (filepath) => {
  return path.parse(filepath).base === FILE.CONTENT.INDEX;
};


const isMarkdownFile = (filepath) => path.parse(filepath).ext === EXT.MARKDOWN;


export default {find, findIndexFiles, findFiles};
// export default find; // TODO: Not sure why this isn't working... test later.
