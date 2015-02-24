var mongo = require('mongo');
var basic = require('basic');

var views = {
  "index": require('../views/index.js'),
  "parts": require('../views/parts.js')
};


module.exports = function (req, res, error) {

  mongo.dicomup(function (err, collections) {
    if (err) basic.reserr(res, err);

    collections.images.find({}).sort({"posted": -1}).toArray(
      function (err, docs) {
        if (err) basic.reserr(res, err);

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(views.parts.first() + views.index(error, docs)
          + views.parts.last());

    });
  });

};
