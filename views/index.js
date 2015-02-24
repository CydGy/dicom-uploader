module.exports = function (err, docs) {

  err = err || {};
  docs = docs || [];

  var images = '';

  if (!docs.length) {

    images = '<p>No resuld found.</p>';

  } else {

    for (var i = 0, c = docs.length; i < c; i++) {
      images += '<a href="/' + docs[i]._id.toHexString() + '">'
          + '<img src="' + docs[i].path + '150x150.jpg">';
        + '</a>';
    }

  }

  var content = '<form name=uploads action="/uploads" method=post'
        + ' enctype="multipart/form-data"'
        + ' class="dropzone"'
        + ' id="dropzone"'
      + '>'
        + '<input type=text name=tags placeholder="Tags your images">'
        + (err.form && err.form === 'uploads'
          && err.message === 'maximum size exceeded'
          && '<p class=error>The maximum size is 10 Mo.</p>'
          || '')
        + (err.form && err.form === 'uploads'
          && err.message === 'image type invalid'
          && '<p class=error>The image type must be "application/dicom"'
           + '</p>'
          || '')
      + '</form>'

      + '<div id=images>'
        + images
      + '</div>';

  return content;

};
