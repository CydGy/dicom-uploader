var fs = require('fs');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var ObjectID = require('mongodb').ObjectID;

var IMAGES_DIR = './public/images/';


/**
 * @param {Object} options
 *        {String} options.path
 *        {Array} options.sizes
 *        {String} [options.tags]
 */

function DICOMimage (options) {

  var options = options || {};
  this.path = options.path;
  this.sizes = options.sizes;
  this.tags = options.tags;

  this._id = new ObjectID();
  this.id = this._id.toHexString();
  this.dir1 = this.id.slice(-1) + '/';
  this.dir2 = this.id.slice(-2, -1) + '/';
  this.dir3 = this.id + '/';
  this.dirpath = IMAGES_DIR + this.dir1 + this.dir2 + this.dir3;

  this.doc = {
    "_id": this._id,
    "posted": new Date(),
    "path": '/images/' + this.dir1 + this.dir2 + this.dir3
  };

}


DICOMimage.prototype.createDirs = function (callback) {

  if (this.dirsCreated) return callback();

  var self = this;

  fs.mkdir(IMAGES_DIR + self.dir1, function (err) {
    if (err && err.code !== 'EEXIST') return callback(err);
  fs.mkdir(IMAGES_DIR + self.dir1 + self.dir2, function (err) {
    if (err && err.code !== 'EEXIST') return callback(err);
  fs.mkdir(IMAGES_DIR + self.dir1 + self.dir2 + self.dir3, function (err) {
    if (err && err.code !== 'EEXIST') return callback(err);

    self.dirsCreated = true;
    callback();

  }); }); });

};


DICOMimage.prototype.saveOriginal = function (callback) {

  if (this.originalSaved) return callback();

  var self = this;

  this.createDirs(function (err) {
    if (err) return callback(err);

    var newPath = self.dirpath + 'original.jpg';
    
    fs.rename(self.path, newPath, function (err) {
      if (err) return callback(err);

      self.path = newPath;
      self.originalSaved = true;
      callback();

    });

  });

};


DICOMimage.prototype.resize = function (callback) {

  if (this.resized) return callback();
  if (!this.sizes.length) return callback();

  var self = this;

  this.createDirs(function (err) {
    if (err) return callback(err);

    for (var i = 0, count = 0, c = self.sizes.length; i < c; i++) {
      (function (i) {

        var size = self.sizes[i];
        var newPath = self.dirpath + size + '.jpg';
        
        var args = [
          self.path,
          '-thumbnail', size + '^',
          '-gravity', 'Center',
          '-extent', size,
          '+repage',
          '-strip',
          '-quality', '92',
          '-format', 'JPEG',
          newPath
        ];

        var convert = spawn('convert', args);

        convert.on('error', function (err) {
          callback(err);
        });

        convert.on('close', function (code) {

          if (code !== 0) {
            var err = new Error('convert process closed with code: ' + code);
            return callback(err);
          }
          
          if (++count === c) {
            self.resized = true;
            callback();
          }

        });

      })(i);
    }

  });

};


/**
 * gdcmconv
 * http://gdcm.sourceforge.net/html/gdcmconv.html
 */

DICOMimage.prototype.decompress = function (callback) {

  if (this.isDecompressed) return callback();

  var self = this;

  var args = ['--raw', this.path, this.path];
  
  var gdcmconv = spawn('gdcmconv', args);

  gdcmconv.on('error', function (err) {
    callback(err);
  });

  gdcmconv.on('close', function (code) {

    if (code !== 0) {
      var err = new Error('gdcmconv process closed with code: ' + code);
      return callback(err);
    }

    self.isDecompressed = true;
    callback();

  });

};


/**
 * dcmdump
 * http://support.dcmtk.org/docs/dcmdump.html
 */

DICOMimage.prototype.setKeyInformation = function (callback) {

  if (this.keyInformationPlaced) return callback();

  var self = this;

  var dcmdump = exec('dcmdump ' + this.path
    + ' | grep -E "PatientName|PatientID|StudyDescription|StudyDate"',
    function (err, stdout, stderr) {
      if (err) return callback(err);

      stdout = stdout.split('\n');

      if (stdout[0]) {
        /\[([0-9]{4})([0-9]{2})([0-9]{2})\]/.test(stdout[0]);
        self.doc.StudyDate = new Date(RegExp.$1, RegExp.$2, RegExp.$3);
      }

      if (stdout[1])
        self.doc.StudyDescription = stdout[1].slice(stdout[1].indexOf('[') + 1,
          stdout[1].indexOf(']'));

      if (stdout[2])
        self.doc.PatientName = stdout[2].slice(stdout[2].indexOf('[') + 1,
          stdout[2].indexOf(']'));

      if (stdout[3])
        self.doc.PatientID = stdout[3].slice(stdout[3].indexOf('[') + 1,
          stdout[3].indexOf(']'));

      self.keyInformationPlaced = true;
      callback();

  });

};


DICOMimage.prototype.setTags = function () {

  if (this.tagsPlaced) return;

  if (this.tags && /^[ a-zA-Z0-9]{1,100}$/.test(this.tags))
    this.doc.tags = this.tags.split(' ');

  this.tagsPlaced = true;

};


/**
 * dcmj2pnm
 * http://support.dcmtk.org/docs/dcmj2pnm.html
 */

DICOMimage.prototype.convertToJPEG = function (callback) {

  if (this.alreadyConvertedToJPEG) return callback();

  var self = this;

  var args = ['+oj', '+Jq', '90', '+Wi', '1', this.path, this.path];

  var dcmj2pnm = spawn('dcmj2pnm', args);

  dcmj2pnm.on('error', function (err) {
    callback(err);
  });

  dcmj2pnm.on('close', function (code) {

    if (code !== 0) {
      var err = new Error('dcmj2pnm process closed with code: ' + code);
      return callback(err);
    }

    self.alreadyConvertedToJPEG = true;
    callback();

  });

};


module.exports = DICOMimage;
