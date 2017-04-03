import chokidar from 'chokidar';
import cliPublisher from './publisher';
import logger from '../helpers/log';


const log = logger();


// start watcher... republish all files on change
export const watcher = async (siteconfig) => {
  const publisher = cliPublisher(siteconfig);

  const watchdir = [
    siteconfig.dir.content,
    siteconfig.dir.layouts,
  ];

  const watcher = chokidar.watch(watchdir, {
    varignored: /^.+?\.sw.?$/,
    persistent: true,
  });

  watcher.on('ready', () => {
    log.verbose(
        `cli.watcher.watcher: Initial scan completed. Waiting for changes.`);

    watcher.on('add', (path) => {
      log.verbose(`cli.watcher.watcher: File ${path} has been added.`);
      publisher.reload();
      publisher.publishSite();
    }).on('change', (path) => {
      log.verbose(`cli.watcher.watcher: File ${path} has been changed.`);
      publisher.reload();
      publisher.publishSite();
    }).on('unlink', (path) => {
      log.verbose(`cli.watcher.watcher: File ${path} has been removed.`);
      publisher.reload();
      publisher.publishSite();
    }).on('addDir', (path) => {
      log.verbose(`cli.watcher.watcher: Directory ${path} has been added.`);
      publisher.reload();
      publisher.publishSite();
    }).on('unlinkDir', (path) => {
      log.verbose(`cli.watcher.watcher: Directory ${path} has been removed.`);
      publisher.reload();
      publisher.publishSite();
    });
  });
};


export default watcher;
