var GedcomXDate = require('gedcomx-date'),
    marked = require('marked'),
    renderer = new marked.Renderer(),
    mustache = require('mustache');

var utils = module.exports = {
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
utils.getFactYear = function(fact) {
  if(fact.$getFormalDate()) {
    var simple = utils.getSimpleFormalDate(fact.$getFormalDate());
    if(simple){
      return simple.getYear();
    }
  } else if(fact.$getDate()) {
    return utils.extractYearFromDateString(fact.$getDate());
  }
};

/**
 * Extract a place string from a fact.
 * Returns undefined if there is no place.
 */
utils.getFactPlace = function(fact) {
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
utils.getFormalDate = function(fact){
  if(fact.$getFormalDate()) {
    var date = utils.getSimpleFormalDate(fact.$getFormalDate());
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
 * Think twice before using this directly. You should probably use utils.getFormalDate
 * instead. It will simplify your life immensly.
 */
utils.getSimpleFormalDate = function(formalDateString){
  try {
    var date = new GedcomXDate(formalDateString);
    if(date.getType() != 'single') {
      if(date.getStart() && !date.getEnd()) {
        date = date.getStart();
      } else if(!date.getStart() && date.getEnd()) {
        date = date.getEnd();
      } else {
        var start = date.getStart(),
            duration = date.getDuration(),
            halfDuration = GedcomXDate.multiplyDuration(duration, .5);
        date = GedcomXDate.addDuration(start, halfDuration);
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
utils.extractYearFromDateString = function(date){
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
 * Convert mustache markdown template into HTML
 */
utils.markdown = function(text, data, partials) {
  return marked(mustache.render(text, data, partials), { renderer: renderer });
};

/**
 * Generate a gensearch object with as much
 * person data as we can get
 */
utils.gensearchPerson = function(person){
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
    var birthPlace = utils.getFactPlace(birth);
    if(birthPlace){
      gensearch.birthPlace = birthPlace;
    }
    var birthDate = utils.getFactYear(birth);
    if(birthDate){
      gensearch.birthDate = birthDate+'';
    }
  }
  
  var death = person.$getDeath();
  if(death !== undefined){
    var deathPlace = utils.getFactPlace(death);
    if(deathPlace){
      gensearch.deathPlace = deathPlace;
    }
    var deathDate = utils.getFactYear(death);
    if(deathDate){
      gensearch.deathDate = deathDate+'';
    }
  }
  
  return gensearch;
};

/**
 * Compare two formal dates
 */
utils.compareFormalDates = function(date1, date2){
  return GedcomXDate.compare(date1, date2);
};

/**
 * Generate an opportunity
 */
utils.createOpportunity = function(check, person, template, gensearch){
  return {
    id: check.id + ':' + person.id,
    type: check.type,
    checkId: check.id,
    personId: person.id,
    person: person,
    gensearch: gensearch,
    template: template
  };
};

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}