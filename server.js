var http = require('http');
var url = require('url');


var server = http.createServer(function (req, res) {

  var urlparsed = url.parse(req.url, true);
  var pathname = urlparsed.pathname;
  req.urlparsed = urlparsed;
  req.pathname = pathname;

  if (req.method === 'GET') {

    if (pathname === '/') {
      require('./routes/index.js')(req, res);

    } else if (/\.js$/.test(pathname)) {
      require('./routes/public.js')(req, res, 'js')

    } else if (/\.css$/.test(pathname)) {
      require('./routes/public.js')(req, res, 'css')

    } else if (/^\/images\//.test(pathname)) {
      require('./routes/public.js')(req, res, 'images');

    } else if ( /\.(gif|png|jpg|svg)$/.test(pathname) ) {
      require('./routes/public.js')(req, res, 'img');

    } else if (pathname === '/search') {
      require('./routes/search.js')(req, res);

    } else if (/^\/([0-9a-fA-F]{24})$/.test(pathname)) {
      var imageId = RegExp.$1;
      require('./routes/image.js')(req, res, imageId);

    } else {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('404 Not Found');
    }

  } else if (req.method === 'POST') {

    if (pathname === '/uploads') {
      require('./routes/uploads.js')(req, res);
    } else {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('404 Not Found');
    }

  } else {
    res.writeHead(405, {'Content-Type': 'text/plain'});
    res.end('405 Method Not Allowed');
  }

}).listen(8888);
