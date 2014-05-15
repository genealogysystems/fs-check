var GedcomXDate = require('gedcomx-date');

module.exports = {
  getBirthYear: getBirthYear,
  getBirthPlace: getBirthPlace
}

function getBirthYear(birthFact) {
  if(birthFact.$getFormalDate()) {
    var date = new GedcomXDate(birthFact.$getFormalDate());
    
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
  } else if(birthFact.$getDate()) {
    var date = birthFact.$getDate();
    return /^\d{4}$/.test(date) ? date : new Date(date).getFullYear();
  } else {
    return;
  }

}

function getBirthPlace(birthFact) {
  if(birthFact.$getNormalizedPlace()) {
    return birthFact.$getNormalizedPlace();
  } else if(birthFact.$getPlace()) {
    return birthFact.$getPlace();
  } else {
    return;
  }

}