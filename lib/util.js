var GedcomXDate = require('gedcomx-date'),
    marked = require('marked'),
    renderer = new marked.Renderer(),
    mustache = require('mustache');

module.exports = {
  gensearchPerson: gensearchPerson,
  createOpportunity: createOpportunity,
  getFactYear: getFactYear,
  getFactPlace: getFactPlace,
  getFormalDate: getFormalDate,
  getSimpleFormalDate: getSimpleFormalDate,
  getNormalizedDateString: getNormalizedDateString,
  getSimpleDurationString: getSimpleDurationString,
  compareFormalDates: compareFormalDates,
  markdown: markdown,
  monthNumberToString: monthNumberToString,
  GedcomXDate: GedcomXDate
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
 *   - Try to parse with JS date object and generate a simple formal date with it
 *   - Return undefined if this fails
 */
function getFormalDate(fact){
  if(fact.$getFormalDate()) {
    var date = getSimpleFormalDate(fact.$getFormalDate());
    if(date){
      return date.toFormalString();
    }
  } else if(fact.$getDate()) {
    if(/^\d{4}$/.test(fact.$getDate())){
      return '+' + fact.$getDate();
    } else {
      var date = new Date(fact.$getDate());
      // Invalid date
      if(isNaN(date.getTime())){
        return;
      } 
      // Valid date
      else {
        // Substring to remove time component
        return GedcomXDate.fromJSDate(date).toFormalString().substring(0, 11);
      }
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

/**
 * Return an FS normalized date string from a GedcomX formal date string
 */
function getNormalizedDateString(formalString){
  var date = new GedcomXDate(formalString);
  return date.getDay() + ' ' + monthNumberToString(date.getMonth()) + ' ' + date.getYear();
};
function monthNumberToString(month){
  switch(month){
    case 1:
      return 'January';
    case 2:
      return 'February';
    case 3:
      return 'March';
    case 4:
      return 'April';
    case 5:
      return 'May';
    case 6:
      return 'June';
    case 7:
      return 'July';
    case 8:
      return 'August';
    case 9:
      return 'September';
    case 10:
      return 'October';
    case 11:
      return 'November';
    case 12:
      return 'December';
  }
  return '';
};

/**
 * Return a human-readable string representing a duration
 */
function getSimpleDurationString(duration){
  var string = '',
      years = duration.getYears(),
      months = duration.getMonths(),
      days = duration.getDays();
  if(years){
    if(years === 1){
      string = '1 year';
    } else {
      string += years + ' years';
    }
  }
  if(months){
    if(string){
      string += ' and ';
    }
    if(months === 1){
      string += '1 month';
    } else {
      string += months + ' months';
    }
  }
  if(!string && days){
    if(days === 1){
      string += '1 day';
    } else {
      string += days + ' days';
    }
  }
  return string;
};

function markdown(text) {
  var data = {};

  if(arguments.length > 1) {
    data = arguments[1];
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
  // Ignore leading A which denote approximate date
  if(date1.charAt(0) === 'A'){
    date1 = date1.substr(1);
  }
  if(date2.charAt(0) === 'A'){
    date2 = date2.substr(1);
  }
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
 * Generate an opportunity
 */
function createOpportunity(check, person, template, gensearch){
  return {
    id: check.id + ':' + person.id,
    type: check.type,
    checkId: check.id,
    personId: person.id,
    person: person,
    gensearch: gensearch,
    template: template
  };
}