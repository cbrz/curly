import fm from 'front-matter';
import fs from 'fs-promise';
import path from 'path';

import contentFactorySetup from '../content/factory';
import finder from '../finder';
import logger from '../helpers/log';
import urljoin from '../helpers/urljoin';
import publisherSetup from '../publisher';


const log = logger();


// returns object with publishing functions
export const publisher = (siteconfig) => {
  const contentFactory = contentFactorySetup(siteconfig);
  let publisher = publisherSetup(siteconfig);

  return {
    clearPublishFiles: () => clearPublishFiles(siteconfig),
    publishAttributeFiles: () => publishAttributeFiles(
        siteconfig, publisher, contentFactory),
    publishFiles: () => publishFiles(
        siteconfig, publisher, contentFactory),
    publishIndexFiles: () => publishIndexFiles(
        siteconfig, publisher, contentFactory),
    publishPublicFiles: () => publishPublicFiles(siteconfig, publisher),
    publishSite: () => publishSite(
        siteconfig, publisher, contentFactory),
    reload: () => {
      publisher = publisherSetup(siteconfig);
    },
  };
};


// publish entire site
export const publishSite = async (siteconfig, publisher, contentFactory) => {
  await clearPublishFiles(siteconfig);
  publishAttributeFiles(siteconfig, publisher, contentFactory);
  publishFiles(siteconfig, publisher, contentFactory);
  publishIndexFiles(siteconfig, publisher, contentFactory);
  publishPublicFiles(siteconfig, publisher);
};


// remove all files from publish directory
export const clearPublishFiles = async (siteconfig) => {
  log.verbose(
      'cli.publisher.clearPublishFiles: Clearing contents of "%s".',
      siteconfig.dir.publish);

  await fs.emptyDir(siteconfig.dir.publish);
};


// create index files (as side effect)
export const publishIndexFiles = async (
    siteconfig, publisher, contentFactory) => {
  log.verbose(
      'cli.publisher.publishIndexFiles: Publish index files to "%s".',
      siteconfig.dir.publish);

  let ignoredirs = [];
  if (siteconfig.render.ignoredirs) {
    ignoredirs = siteconfig.render.ignoredirs.map((dirname) => {
      const ignoredir = path.join(siteconfig.dir.content, dirname);
      log.verbose(
          'cli.publisher.publishIndexFiles: Ignoring directory "%s".',
          ignoredir);

      return ignoredir;
    });
  } else {
    log.verbose(
        'cli.publisher.publishIndexFiles: ' +
        'Config file does not a contain render.ignoredirs key. Skipping.');
  }

  const files = await finder.findIndexFiles(siteconfig.dir.content, ignoredirs);

  Promise.all(files.map(async (file) => {
    log.verbose('cli.publisher.publishIndexFiles: Parse file "%s"', file);
    const indexfile = await contentFactory.parse(file);
    indexfile.children = await finder.findFiles(
        path.parse(file).dir, ignoredirs, (children) => {
          return Promise.all(children.map(async (child) => {
            log.verbose(
                'cli.publisher.publishIndexFiles: ' +
                'Parse child "%s" to file "%s".',
                child,
                file);
            return await contentFactory.parse(child);
          }));
        });

    indexfile.children = indexfile.children.sort(sortChildren);
    await publisher.publish(indexfile);
  }));
};


// create files (as side effect)
export const publishFiles = async (siteconfig, publisher, contentFactory) => {
  log.verbose('cli.publisher.publishFiles: Publish files to "%s".',
      siteconfig.dir.publish);

  const files = await finder.findFiles(siteconfig.dir.content);

  Promise.all(files.map(async (file) => {
    log.verbose('cli.publisher.publishFiles: Parse file "%s"', file);
    const contentfile = await contentFactory.parse(file);
    await publisher.publish(contentfile);
  }));
};


// create attributes files (as side effect)
// TODO see if it's possible to add unit tests for this function
export const publishAttributeFiles = async (
    siteconfig, publisher, contentFactory) => {
  log.verbose(
      'cli.publisher.publishAttributeFiles: Publish attribute files to "%s".',
      siteconfig.dir.publish);

  const attributeData = await generateAttributeData(siteconfig);

  Promise.all(attributeData.map(async (data) => {
    const urlattr = urljoin(data.key);
    const parentcontentfile = await contentFactory.create(urlattr);
    parentcontentfile.title = data.key;
    parentcontentfile.children = [];

    for (let key of Object.keys(data.value)) {
      const contentfile = await contentFactory.create(
          urljoin(urlattr, replaceSpaceWithUnderscore(key)));
      contentfile.title = key;
      contentfile.pagelimit = Number.MAX_SAFE_INTEGER;
      contentfile.children = await Promise.all(
          data.value[key].map(async (file) => {
            return await contentFactory.parse(file);
          }));

      contentfile.children = contentfile.children.sort(sortChildren);
      await publisher.publish(contentfile);
      parentcontentfile.children.push(contentfile);
    }

    parentcontentfile.children = parentcontentfile.children.sort(sortChildren);
    await publisher.publish(parentcontentfile);
  }));
};


// copy public files to publish directory
// TODO find way to copy some public files to publish directory...
// for example images would need to be places in an images directory,
// however it's awkward to copy it to each layouts theme
export const publishPublicFiles = async (siteconfig, publisher) => {
  log.verbose(
      'cli.publisher.publishPublicFiles: Publish public files to "%s".',
      siteconfig.dir.publish);
  await publisher.publishPublic();
};


// returns object categorizing attributes and files associated with them
// TODO Add unit tests for this function
const generateAttributeData = async (siteconfig) => {
  log.verbose(
      'cli.publisher.generateAttributeData: ' +
      'Generating attribute data from files.');

  if (!siteconfig.render.attributes) {
    log.verbose(
        'cli.publisher.generateAttributeData: ' +
        'Config file does not contain a render.attributes key. Skipping.');
    return [];
  }

  const files = await finder.findFiles(siteconfig.dir.content);

  const fileattrs = await Promise.all(files.map(async (file) => {
    log.verbose('cli.publisher.generateAttributeData: Parse file "%s".', file);
    const filecontent = await fs.readFile(file, 'utf8');
    const attributes = fm(filecontent).attributes;
    return {file, attributes};
  }));

  return siteconfig.render.attributes.reduce((accData, attribute) => {
    const value = fileattrs.reduce((accAttributeValues, fileattr) => {
      if (fileattr.attributes.hasOwnProperty(attribute)) {
        const attributeValues = fileattr.attributes[attribute];

        if (Array.isArray(attributeValues)) {
          log.verbose(
              ('cli.publisher.generateAttributeData: ' +
               'Found attribute tag "%s" in file "%s". ' +
               'Adding tags.'),
              attribute,
              fileattr.file);

          attributeValues.forEach((value) => {
            if (!accAttributeValues[value])
              accAttributeValues[value] = [];
            if (accAttributeValues[value].indexOf(fileattr.file) === -1)
              accAttributeValues[value].push(fileattr.file);
          });
        }
      }
      return accAttributeValues;
    }, {});

    if (value)
      accData.push({key: attribute, value});
    return accData;
  }, []);
};


const replaceSpaceWithUnderscore = (string) => string.replace(' ', '_');


const sortChildren = (childA, childB) => {
  return childB.date - childA.date;
};


export default publisher;
