/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is no date
 *  3. There is a place
 */
var utils = require('../util.js');

module.exports = {
  id: 'missingBirthDate',
  type: 'person',
  title: 'Find a Birth Date',
  signature: 'person',
  check: function(person) {

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

    var template = {
      name: person.$getDisplayName(),
      pid:  person.id
    };

    return utils.createOpportunity(this, person, template, utils.gensearchPerson(person));

  }
};