var utils = require('../util.js');

module.exports = function(person) {

  var death = person.$getDeath();

  if(death) {
    if(utils.getFactPlace(death) !== undefined || utils.getFactYear(death) !== undefined) {
      return;
    }
  }

  // TODO if they have a christening record, change the description

  var opportunity = {
    type: 'person',
    title: 'Find a Death',
    description: 'Execute some general searches and try to find a death record.',
    person: person,
    findarecord: undefined,
    gensearch: {
      givenName: person.$getGivenName(),
      familyName: person.$getSurname(),
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