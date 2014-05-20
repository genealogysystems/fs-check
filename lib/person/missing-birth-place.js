/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is no place
 *  3. There is a date
 */
var utils = require('../util.js');

module.exports = function(person) {

  var birth = person.$getBirth();

  if(!birth) {
    return;
  }

  // If we already have a birth place
  if(utils.getFactPlace(birth) !== undefined) {
    return;
  }

  var year = utils.getFactYear(birth)

  // If we don't have a date AND place, then we count it as not having a birth
  if(year === undefined) {
    return;
  }

  // TODO if they have a christening record, change the description

  var opportunity = {
    type: 'person',
    title: 'Find a Birth Place',
    description: 'Execute some general searches and try to find a birth place.',
    person: person,
    findarecord: undefined,
    gensearch: {
      givenName: person.$getGivenName(),
      familyName: person.$getSurname(),
      birthDate: year+''
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