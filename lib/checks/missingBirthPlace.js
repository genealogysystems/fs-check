/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is no place
 *  3. There is a date
 */
var utils = require('../util.js');

module.exports = {
  id: 'missingBirthPlace',
  type: 'person',
  signature: 'person',
  help: [],
  check: function(person) {

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

    var template = {
      name: person.$getDisplayName(),
      pid:  person.id
    };

    return utils.createOpportunity(this, person, template, utils.gensearchPerson(person));

  }
};