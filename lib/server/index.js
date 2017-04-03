import express from 'express';
import fs from 'fs-promise';
import http from 'http';


// return http server
export const server = (dir) => {
  if (!fs.existsSync(dir)) {
    throw new Error(
      'Directory "%s" does not exist. ' +
      'Please specify an existing directory.',
      dir
    );
  }

  // setup webserver
  const app = express();
  app.set('view engine', 'hbs');

  // serve directory as static
  app.use(express.static(dir));

  // 404 error
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // Error handling
  app.use((err, req, res, next) => {
    if (err.status === 400)
      console.error('404 error found');

    console.error(err);

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
  });

  return http.createServer(app);
};


export default server;

