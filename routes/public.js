var fs = require('fs');
var basic = require('basic');


module.exports = function (req, res, type) {

  var pathname = req.pathname;

  if (type === 'js') {

    fs.readFile('./public/js' + pathname, function (err, data) {
      if (err) {
        if (err.code === 'ENOENT') return resNotFound();
        else return basic.reserr(res, err);
      }
      res.writeHead(200, {"Content-Type": "text/javascript"});
      res.end(data)
    });

  }

  else if (type === 'css') {
    fs.readFile('./public/css' + pathname, function (err, data) {
      if (err) {
        if (err.code === 'ENOENT') return resNotFound();
        else return basic.reserr(res, err);
      }
      res.writeHead(200, {"Content-Type": "text/css"});
      res.end(data)
    });
  }

  else if (type === 'images') {
    fs.readFile('./public/images/' + pathname.substring(8),
      function (err, data) {
        if (err) {
          if (err.code === 'ENOENT') return resNotFound();
          else return basic.reserr(res, err);
        }
        res.writeHead(200, {"Content-Type": "image/jpeg"});
        res.end(data)
    });
  }

  else if (type === 'img') {
    fs.readFile('./public/img' + pathname, function (err, data) {
      if (err) {
        if (err.code === 'ENOENT') return resNotFound();
        else return basic.reserr(res, err);
      }
      if (/\.gif$/.test(pathname))
        res.writeHead(200, {"Content-Type": "image/gif"});
      else if (/\.jpg$/.test(pathname))
        res.writeHead(200, {"Content-Type": "image/jpeg"});
      else if (/\.png$/.test(pathname))
        res.writeHead(200, {"Content-Type": "image/png"});
      else if (/\.svg$/.test(pathname))
        res.writeHead(200, {"Content-Type": "image/svg+xml"});
      res.end(data)
    });
  }

  function resNotFound() {
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.end('404 Not Found');
  }

};
