import parseArgs from 'minimist';
import path from 'path';

import constants from './constants';
import cliPublisher from './cli/publisher';
import cliServer from './cli/server';
import cliWatcher from './cli/watcher';
import logger, {setLogLevel} from './helpers/log';
import siteconfigParser from './siteconfig';


const log = logger();


// publish files
export const publish = async (siteconfig) => {
  log.info('main.server: Initiating Curly "publish".');

  try {
    const publisher = cliPublisher(siteconfig);
    publisher.publishSite();
  } catch(err) {
    console.error(err);
  }
};


// serve files. DO NOT USE IN PRODUCTION.
export const server = async (siteconfig) => {
  log.info('main.server: Initiating Curly "server".');

  try {
    const publisher = cliPublisher(siteconfig);
    publisher.publishSite();

    const server = await cliServer(siteconfig);
    server.listen();
  } catch(err) {
    console.error(err);
  }
};


// watch files in layouts/content directory and re-publishes on change
export const watch = async (siteconfig) => {
  log.info('main.watch: Initiating Curly "watch".');

  try {
    cliWatcher(siteconfig);
    server(siteconfig);
  } catch(err) {
    console.error(err);
  }
};


export const init = async (siteconfig) => {
};


// main
export const main = async (argv) => {
  log.info('main.main: Starting Curly.');
  log.info('main.main: Parsing Curly arguments.');
  const args = parseArgs(argv);
  const action = args._[0];
  log.debug('main.main: args=[%s]', JSON.stringify(args, null, '\t'));

  setLogLevel(constants.LOGLEVELS.VERBOSE);

  const sitedir = path.resolve(args._[1]) || process.cwd();
  const siteconfigpath = path.join(sitedir, constants.FILE.SITE.CONFIG);
  const siteconfig = siteconfigParser.parse(sitedir, siteconfigpath);

  log.info('main.main: Executing Curly action "%s".', action);
  log.debug(
      'main.main: siteconfig=[%s]', JSON.stringify(siteconfig, null, '\t'));
  module.exports[action](siteconfig);
};


export default main;
