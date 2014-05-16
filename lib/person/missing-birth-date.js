var utils = require('../util.js');

module.exports = function(person) {

  var birth = person.$getBirth();

  if(!birth) {
    return;
  }

  // If we already have a birth date
  if(utils.getFactYear(birth) !== undefined) {
    return;
  }

  var place = utils.getFactPlace(birth)

  // If we don't have a date AND place, then we count it as not having a birth
  if(place === undefined) {
    return;
  }

  // TODO if they have a christening record, change the description

  var opportunity = {
    type: 'person',
    title: 'Find a Birth Date',
    description: 'Execute some general searches and try to find a birth place.',
    person: person,
    findarecord: undefined,
    gensearch: {
      givenName: person.$getGivenName(),
      familyName: person.$getSurname(),
      birthPlace: place
    }
  };

  var death = person.$getDeath();
  if(death !== undefined) {
    opportunity.gensearch.deathPlace = utils.getFactPlace(death);
    opportunity.gensearch.deathDate = utils.getFactYear(death)+'';
  }

  // TODO enhance the genSearch Object

  return opportunity;

}