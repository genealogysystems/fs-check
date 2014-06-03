var GedcomXDate = require('gedcomx-date'),
    multiline = require('multiline'),
    marked = require('marked'),
    renderer = new marked.Renderer(),
    mustache = require('mustache');

renderer.heading = function (text, level) {
  return '<h'
    + level
    + '>'
    + text
    + '</h'
    + level
    + '>\n';
}

module.exports = {
  getFactYear: getFactYear,
  getFactPlace: getFactPlace,
  markdown: markdown
}

function getFactYear(fact) {
  if(fact.$getFormalDate()) {
    try {
      var date = new GedcomXDate(fact.$getFormalDate());
      if(date.getType() != 'single') {
        if(date.getStart() && !date.getEnd()) {
          date = date.getStart();
        } else if(!date.getStart() && date.getEnd()) {
          date = date.getEnd();
        } else {
          date = GedcomXDate.addDuration(date.getStart(), GedcomXDate.multiplyDuration(date.getDuration(), .5));
        }
      }
      return date.getYear();
    } catch(error) {}
  } else if(fact.$getDate()) {
    var date = fact.$getDate();
    if(/^\d{4}$/.test(date)){
      return date;
    } else {
     var year = new Date(date).getFullYear();
     if(parseInt(year) == year){
      return year;
     }
    }
  }
}

function getFactPlace(fact) {
  if(fact.$getNormalizedPlace()) {
    return fact.$getNormalizedPlace();
  } else if(fact.$getPlace()) {
    return fact.$getPlace();
  } else {
    return;
  }

}

function markdown(func) {
  var text,
      data = {};

  if(arguments.length > 1) {
    data = arguments[1];
  }

  try{
    text = multiline.stripIndent(func);
  } catch(e) {
    text = 'Unsupported Browser';
  }

  return marked(mustache.render(text, data), { renderer: renderer });
}