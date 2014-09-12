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
};

module.exports = {
  gensearchPerson: gensearchPerson,
  getFactYear: getFactYear,
  getFactPlace: getFactPlace,
  compareFormalDates: compareFormalDates,
  markdown: markdown
};

/**
 * Do all we can to extract a 4 digit year from a date string
 */
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
};

/**
 * Extract a place string from a fact
 */
function getFactPlace(fact) {
  if(fact.$getNormalizedPlace()) {
    return fact.$getNormalizedPlace();
  } else if(fact.$getPlace()) {
    return fact.$getPlace();
  } else {
    return;
  }
};

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
};

/**
 * Generate a gensearch object with as much
 * person data as we can get
 */
function gensearchPerson(person){
  var gensearch = {};
  
  var givenName = person.$getGivenName();
  if(givenName){
    gensearch.givenName = givenName;
  }
  
  var familyName = person.$getSurname();
  if(familyName){
    gensearch.familyName = familyName;
  }
  
  var birth = person.$getBirth();
  if(birth !== undefined){
    var birthPlace = getFactPlace(birth);
    if(birthPlace){
      gensearch.birthPlace = birthPlace;
    }
    var birthDate = getFactYear(birth);
    if(birthDate){
      gensearch.birthDate = birthDate+'';
    }
  }
  
  var death = person.$getDeath();
  if(death !== undefined){
    var deathPlace = getFactPlace(death);
    if(deathPlace){
      gensearch.deathPlace = deathPlace;
    }
    var deathDate = getFactYear(death);
    if(deathDate){
      gensearch.deathDate = deathDate+'';
    }
  }
  
  return gensearch;
};

/**
 * Compare two formal dates
 */
function compareFormalDates(date1, date2){
  if(date1 === date2){
    return 0;
  }
  try {
    GedcomXDate.getDuration(new GedcomXDate(date1), new GedcomXDate(date2));
    return -1;
  } catch(e) {
    return 1;
  }
};