"use strict";
var connect = require('connect');
var http = require('http');
var optimist = require('optimist');
var path = require('path');
var reactMiddleware = require('react-page-middleware');
var convert = require('./convert.js');

var argv = optimist.argv;

var PROJECT_ROOT = path.resolve(__dirname, '..');
var FILE_SERVE_ROOT = path.join(PROJECT_ROOT, 'src');

var port = argv.port;
if (argv.$0 === 'node ./server/generate.js') {
  // Using a different port so that you can publish the website
  // and keeping the server up at the same time.
  port = 8079;
}

var buildOptions = {
  projectRoot: PROJECT_ROOT,
  pageRouteRoot: FILE_SERVE_ROOT,
  useBrowserBuiltins: false,
  logTiming: true,
  useSourceMaps: true,
  ignorePaths: function(p) {
    return p.indexOf('__tests__') !== -1;
  },
  serverRender: true,
  dev: argv.dev !== 'false',
  static: true
};

var app = connect()
  .use(function(req, res, next) {
    // convert all the md files on every request. This is not optimal
    // but fast enough that we don't really need to care right now.
    convert();
    next();
  })
  .use(reactMiddleware.provide(buildOptions))
  .use(connect['static'](FILE_SERVE_ROOT))
  .use(connect.favicon(path.join(FILE_SERVE_ROOT, 'elements', 'favicon', 'favicon.ico')))
  .use(connect.logger())
  .use(connect.compress())
  .use(connect.errorHandler());

var portToUse = port || 8080;
var server = http.createServer(app);
server.listen(portToUse);
console.log('Open http://localhost:' + portToUse + '/jsx/index.html');
module.exports = server;
