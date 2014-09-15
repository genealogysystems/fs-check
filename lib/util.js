var GedcomXDate = require('gedcomx-date'),
    multiline = require('multiline'),
    marked = require('marked'),
    renderer = new marked.Renderer(),
    mustache = require('mustache');

module.exports = {
  gensearchPerson: gensearchPerson,
  getFactYear: getFactYear,
  getFactPlace: getFactPlace,
  getFormalDate: getFormalDate,
  compareFormalDates: compareFormalDates,
  farSearchUrl: farSearchUrl,
  markdown: markdown
};

renderer.heading = function (text, level) {
  return '<h'
    + level
    + '>'
    + text
    + '</h'
    + level
    + '>\n';
};

/**
 * Do all we can to extract a 4 digit year from a Fact.
 * Returns undefined if we fail.
 */
function getFactYear(fact) {
  if(fact.$getFormalDate()) {
    var simple = getSimpleFormalDate(fact.$getFormalDate());
    if(simple){
      return simple.getYear();
    }
  } else if(fact.$getDate()) {
    return extractYearFromDateString(fact.$getDate());
  }
};

/**
 * Extract a place string from a fact.
 * Returns undefined if there is no place.
 */
function getFactPlace(fact) {
  if(fact.$getNormalizedPlace()) {
    return fact.$getNormalizedPlace();
  } else if(fact.$getPlace()) {
    return fact.$getPlace();
  }
};

/**
 * Do our best to return a simple formal gedcomx date from a fact.
 * - If the date has a formal date 
 *   - If the date is already a simple formal date, just return it.
 *   - If the date is an open-ended date range, return a date representing the beginning or end
 *   - If the date is a closed date range, return a date representing the middle
 * - If the date does not have a formal value
 *   - Try to extract a year and generate a simple formal date with it
 *   - Return undefined if this fails
 */
function getFormalDate(fact){
  if(fact.$getFormalDate()) {
    return getSimpleFormalDate(fact.$getFormalDate());
  } else if(fact.$getDate()) {
    var year = extractYearFromDateString(fact.$getDate());
    if(year){
      return new GedcomXDate('+' + year + '-01-01');
    }
  }
};

/**
 * Given a formal date, return a simple formal date.
 * - If the date is already a simple formal date, just return it.
 * - If the date is an open-ended date range, return a date representing the beginning or end
 * - If the date is a closed date range, return a date representing the middle
 */
function getSimpleFormalDate(formalDateString){
  try {
    var date = new GedcomXDate(formalDateString);
    if(date.getType() != 'single') {
      if(date.getStart() && !date.getEnd()) {
        date = date.getStart();
      } else if(!date.getStart() && date.getEnd()) {
        date = date.getEnd();
      } else {
        date = GedcomXDate.addDuration(date.getStart(), GedcomXDate.multiplyDuration(date.getDuration(), .5));
      }
    }
    return date;
  } catch(error) {
    if(console.error){
      console.error('Error parsing ' + formalDateString);
      console.error(error);
    }
  }
};

/**
 * Do all we can to extract a 4 digit year from an arbitraty date string.
 * Returns undefined if we can't get anything
 */
function extractYearFromDateString(date){
  if(/^\d{4}$/.test(date)){
    return date;
  } else {
    var year = new Date(date).getFullYear();
    if(parseInt(year) == year){
      return year;
    }
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

/**
 * Generate a url for a Find-A-Record record search
 */
function farSearchUrl(data){
  var url = 'https://www.findarecord.com/search';
  if(data){
    var urlData = {
      t: data.tags ? data.tags.join(',') : undefined,
      from: data.from,
      to: data.to,
      s: data.place
    };
    var hash = generateURLHash(urlData);
    if(hash){
      url += '#' + hash;
    }
  }
  return url;
};

function generateURLHash(data){
  var hash = '';
  for(var x in data){
    if(typeof data[x] !== 'undefined') {
      if(hash){
        hash += '&';
      }
      hash += x + '=' + encodeURIComponent(data[x]);
    }
  }
  return hash;
};