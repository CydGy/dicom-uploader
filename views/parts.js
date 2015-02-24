var fs = require('fs');
var dicomupSvg = fs.readFileSync('./public/img/dicomup-svg.html');

exports.first = function () {
  
  var content = '';

  content += '<!DOCTYPE html>'
    + '<html lang=en>'

      + '<head>'
        + '<title>DICOMUP</title>'
        + '<link rel=stylesheet href="/reset.css">'
        + '<link rel=stylesheet href="/buttons.css">'
        + '<link rel=stylesheet href="/dropzone.css">'
        + '<link rel=stylesheet href="/design.css">'
      + '</head>'

      + '<body>'

        + '<header>'
          + '<nav>'
            + '<h1><a href="/">' + dicomupSvg + '</a></h1>'

            + '<form name=search action="/search" method=get'
              + ' accept-charset="utf-8"'
              + ' autocomplete=on'
            + '>'
              + '<input type=text name=value class="search square"'
                + ' maxlength=100>'
              + '<button class="button1 grey" type=submit>Search</button>'
            + '</form>'

          + '</nav>'
        + '</header>'

        + '<main>';

  return content;

};


exports.last = function () {

  var content = '';

  content += '</main>'

        + '<script src="/dropzone.js"></script>'
      + '</body>'

    + '</html>';

  return content;

};
