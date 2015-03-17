/**
 * Returns an opportunity if:
 *  1. The preferred name does not have a surname but does have a given name
 */
var utils = require('../util'),
    help = require('../help');

module.exports = {
  id: 'missingSurname',
  type: 'person',
  signature: 'person',
  help: help.links('alreadyInTree','customEvents','correctingInformation'),
  check: function(person) {

    var givenName = person.$getGivenName(),
        surname = person.$getSurname();

    if(givenName && (surname === undefined || surname === '')) {
      return utils.createOpportunity(this, person, {}, utils.gensearchPerson(person));
    }
  }
};