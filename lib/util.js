var GedcomXDate = require('gedcomx-date');

module.exports = {
  getFactYear: getFactYear,
  getFactPlace: getFactPlace
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