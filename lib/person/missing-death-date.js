var utils = require('../util.js');

module.exports = function(person) {

  var death = person.$getDeath();

  if(!death) {
    return;
  }

  // If we already have a death date
  if(utils.getFactYear(death) !== undefined) {
    return;
  }

  var place = utils.getFactPlace(death)

  // If we don't have a date AND place, then we count it as not having a death
  if(place === undefined) {
    return;
  }

  // TODO if they have a christening record, change the description

  var opportunity = {
    type: 'person',
    title: 'Find a Death Date',
    description: 'Execute some general searches and try to find a death date.',
    person: person,
    findarecord: undefined,
    gensearch: {
      givenName: person.$getGivenName(),
      familyName: person.$getSurname(),
      deathPlace: place
    }
  };

  var birth = person.$getBirth();
  if(birth !== undefined) {
    opportunity.gensearch.birthPlace = utils.getFactPlace(birth);
    opportunity.gensearch.birthDate = utils.getFactYear(birth)+'';
  }

  // TODO enhance the genSearch Object

  return opportunity;

}