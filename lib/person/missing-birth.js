var utils = require('../util.js');

module.exports = function(person) {

  var birth = person.$getBirth();

  if(birth) {
    if(utils.getFactPlace(birth) !== undefined || utils.getFactYear(birth) !== undefined) {
      return;
    }
  }

  // TODO if they have a christening record, change the description

  var opportunity = {
    type: 'person',
    title: 'Find a Birth',
    description: 'Execute some general searches and try to find a birth record.',
    person: person,
    findarecord: undefined,
    gensearch: {
      givenName: person.$getGivenName(),
      familyName: person.$getSurname(),
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