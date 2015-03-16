/**
 * Returns an opportunity if:
 *  1. There is no birth fact OR place and date are both undefined
 */
var utils = require('../util.js');

module.exports = {
  id: 'missingBirth',
  type: 'person',
  signature: 'person',
  help: [],
  check: function(person) {

    var birth = person.$getBirth();

    if(birth) {
      if(utils.getFactPlace(birth) !== undefined || utils.getFactYear(birth) !== undefined) {
        return;
      }
    }

    // TODO if they have a christening event, change the description

    var template = {
      name: person.$getDisplayName(),
      pid:  person.id
    };

    return utils.createOpportunity(this, person, template, utils.gensearchPerson(person));

  }
};