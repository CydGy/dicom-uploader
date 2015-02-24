var formidable = require('formidable');
var mongo = require('mongo');
var basic = require('basic');

var index = require('./index.js');
var DICOMimage = require('../lib/DICOMimage.js');

var maxSize = 10 * 1024 * 1024;


module.exports = function (req, res) {

  if (req.headers['content-length'] <= maxSize) {

    var form = new formidable.IncomingForm();
    form.uploadDir = './public/uploads';
    form.multiples = true;

    form.parse(req, function (err, fields, files) {
      if (err) return basic.reserr(res, err);

      if (files.file.type === 'application/dicom') {
        if (files.file.size <= maxSize) {

          console.log(fields.tags);

          var dicomImage = new DICOMimage({
            "path": files.file.path,
            "tags": fields.tags,
            "sizes": ['150x150']
          });

          processImage(dicomImage, function (err) {
            if (err) return basic.reserr(res, err);
            basic.redirect_back(req, res);
          });

        } else {
          var err = new Error('maximum size exceeded');
          err.form = 'uploads';
          index(req, res, err);
        }

      } else {
        var err = new Error('image type invalid');
        err.form = 'uploads';
        index(req, res, err);
      }


      function processImage (dicomImage, callback) {

        dicomImage.decompress(function (err) {
          if (err) return callback(err);
        dicomImage.setTags();
        dicomImage.setKeyInformation(function (err) {
          if (err) return callback(err);
        dicomImage.convertToJPEG(function (err) {
          if (err) return callback(err);
        dicomImage.saveOriginal(function (err) {
          if (err) return callback(err);
        dicomImage.resize(function (err) {
          if (err) return callback(err);

        mongo.dicomup(function (err, collections) {
          if (err) return callback(err);
        collections.images.insert(dicomImage.doc, function (err) {
          if (err) return callback(err);
            
          callback();

        });
        });
        });

        });
        });
        });
        });

      }

    });

  } else {
    res.writeHead(413, {"Content-Type": "text/plain"});
    res.end('413 Request Entity Too Large');
  }

};
