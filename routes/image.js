var mongo = require('mongo');
var ObjectID = require('mongodb').ObjectID;
var basic = require('basic');

var views = {
  image: require('../views/image.js'),
  parts: require('../views/parts.js')
};


module.exports = function (req, res, imageId) {
  
  mongo.dicomup(function (err, collections) {
    if (err) return basic.reserr(res, err);

    collections.images.findOne({"_id": new ObjectID(imageId)},
      function (err, doc) {

        if (doc) {

          res.writeHead(200, {"Content-Type": 'text/html'});
          res.end(views.parts.first() + views.image(doc)
            + views.parts.last());

        } else {
          res.writeHead(404, {"Content-Type": 'text/plain'});
          res.end('404 Not Found');
        }

    });

  });

};
