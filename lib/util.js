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
  } else if(fact.$getDate()) {
    var date = fact.$getDate();
    return /^\d{4}$/.test(date) ? date : new Date(date).getFullYear();
  } else {
    return;
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
  var data = {};

  if(arguments.length > 1) {
    data = arguments[1];
  }

  //return mustache.render(multiline.stripIndent(func), data);
  return marked(mustache.render(multiline.stripIndent(func), data), { renderer: renderer });
}