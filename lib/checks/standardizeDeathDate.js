/**
 * Returns an opportunity if:
 *  1. There is a death fact
 *  2. There is an original date
 *  3. There is no formal date
 */
var utils = require('../util'),
    help = require('../help');

module.exports = {
  id: 'standardizeDeathDate',
  type: 'cleanup',
  signature: 'person',
  help: ['standardizing'],
  check: function(person) {

    var death = person.$getDeath();

    // If we have no death return
    if(!death) {
      return;
    }

    // If we have an original date without a formal date
    if(death.$getDate() !== undefined && death.$getNormalizedDate() === undefined) {

      var template = {
        pid: person.id,
        name: person.$getDisplayName(),
        date: death.$getDate()
      };
  
      return utils.createOpportunity(this, person, template);

    }
  }
};