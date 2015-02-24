var mongo = require('mongo');
var basic = require('basic');
var index = require('./index.js');
var views = {
  "index": require('../views/index.js'),
  "parts": require('../views/parts.js')
};


module.exports = function (req, res) {

  var value = req.urlparsed.query.value;

  if (value === '') {

    index(req, res);

  } else if (value && value.length <= 200) {

  mongo.dicomup(function (err, collections) {
    if (err) return basic.reserr(res, err);

    value = value.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
    value = value.replace(' ', '|');
    var reg = basic.regNoCase(value);

    // TODO Advanced search for dates

    var query = {
      $or: [
        {"tags": reg},
        {"PatientName": reg},
        {"PatientID": reg},
        {"StudyDescription": reg}
      ]
    };

    collections.images.find(query).sort({"posted": -1}).toArray(
      function (err, docs) {
        if (err) return basic.reserr(res, err);

        res.writeHead(200, {"Content-Type": 'text/html'});
        res.end(views.parts.first() + views.index(null, docs)
          + views.parts.last());

    });

  });

  } else {
    var err = new Error('no value');
    err.form = 'search';
    res.writeHead(400, {"Content-Type": 'text/html'});
    res.end(views.parts.first() + views.index(err)
      + views.parts.last());
  }

};
