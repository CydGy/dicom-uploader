module.exports = function (doc) {

  var content = '<div id="image">'

      + '<img src="' + doc.path + 'original.jpg">'

      + '<div class=info>'
        + '<p><span>Posted: </span>' + doc.posted + '</p>'
        + '<p><span>Tags: </span>' + (doc.tags || '') + '</p>'
        + '<p><span>Study Date: </span>' + (doc.StudyDate.toDateString() || '')
          + '</p>'
        + '<p><span>Study Description: </span>' + (doc.StudyDescription || '')
          + '</p>'
        + '<p><span>Patient Name: </span>' + (doc.PatientName || '') + '</p>'
        + '<p><span>Patient ID: </span>' + (doc.PatientID || '') + '</p>'
      + '</div>'

    + '</div>';

  return content;

};
