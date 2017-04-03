import {DEFAULTS} from '../constants';
import expressServer from '../server';
import logger from '../helpers/log';


const log = logger();


// setup server and return it
export const server = (siteconfig) => {
  const webserver = expressServer(siteconfig.dir.publish);
  const port = process.env.PORT || siteconfig.site.port || DEFAULTS.PORT;
  let socketmap = {
    id: 0,
    sockets: {},
  };

  return {
    listen: () => listen(webserver, port, socketmap),
    close: () => close(webserver, socketmap),
  };
};


// start listening on server
const listen = (server, port, socketmap) => {
  server.listen(port, () => {
    log.verbose('cli.server.listen: Starting express server.');
    log.verbose('cli.server.listen: Listening on port: %s.', port);
  });

  server.on('connection', (socket) => {
    let socketId = socketmap.id++;
    socketmap.sockets[socketId] = socket;
    log.verbose('cli.server.listen: Socket ID %s opened.', socketId);

    socket.on('close', () => {
      log.verbose('cli.server.listen: Socket ID %s closed.', socketId);
      delete socketmap.sockets[socketId];
    });
  });
};


// close server
const close = (server, socketmap) => {
  for (let socketId of Object.keys(socketmap.sockets)) {
    log.verbose('cli.server.close: Socket ID %s destroyed.', socketId);
    socketmap.sockets[socketId].destroy();
  }

  server.close(() => {
    log.verbose('cli.server.close: Stopping express server.');
  });

  socketmap.sockets = {};
  socketmap.id = 0;
};


export default server;
