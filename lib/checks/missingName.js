/**
 * Returns an opportunity if:
 *  1. There is no name
 */
var utils = require('../util'),
    help = require('../help');

module.exports = {
  id: 'missingName',
  type: 'person',
  signature: 'person',
  help: ['addingAndCorrecting','customEvents'],
  check: function(person) {
    if(!person.names || person.names.length === 0) {
      return utils.createOpportunity(this, person, {}, utils.gensearchPerson(person));
    }
  }
};