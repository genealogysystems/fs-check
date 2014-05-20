/**
 * Returns an opportunity if:
 *  1. There is a death fact
 *  2. There is no place
 *  3. There is a date
 */
var utils = require('../util.js');

module.exports = function(person) {

  var death = person.$getDeath();

  if(!death) {
    return;
  }

  // If we already have a death place
  if(utils.getFactPlace(death) !== undefined) {
    return;
  }

  var year = utils.getFactYear(death)

  // If we don't have a date AND place, then we count it as not having a death
  if(year === undefined) {
    return;
  }

  var opportunity = {
    type: 'person',
    title: 'Find a Death Place',
    description: 'Execute some general searches and try to find a death place.',
    person: person,
    findarecord: undefined,
    gensearch: {
      givenName: person.$getGivenName(),
      familyName: person.$getSurname(),
      deathDate: year+''
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