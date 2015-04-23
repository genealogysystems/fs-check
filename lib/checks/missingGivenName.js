/**
 * Returns an opportunity if:
 *  1. The preferred name does not have a given name but has a surname
 */
var utils = require('../util'),
    help = require('../help');

module.exports = {
  id: 'missingGivenName',
  type: 'person',
  signature: 'person',
  help: help.links('addingAndCorrecting','customEvents'),
  check: function(person) {

    var givenName = person.$getGivenName(),
        surname = person.$getSurname();

    if(surname && (givenName === undefined || givenName === '')) {
      return utils.createOpportunity(this, person, {}, utils.gensearchPerson(person));
    }
  }
};