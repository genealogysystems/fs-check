/**
 * Returns an opportunity if:
 *  1. There is a death fact
 *  2. There is an original place
 *  3. There is no normalized place
 */
var utils = require('../util'),
    help = require('../help');

module.exports = {
  id: 'standardizeDeathPlace',
  type: 'cleanup',
  signature: 'person',
  help: ['standardizing'],
  check: function(person) {

    var death = person.$getDeath();

    // If we have no death return
    if(!death) {
      return;
    }

    // If we have an original place without a normalized place
    if(death.$getPlace() !== undefined && death.$getNormalizedPlace() === undefined) {

      var template = {
        pid: person.id,
        name: person.$getDisplayName(),
        place: death.$getPlace()
      };
  
      return utils.createOpportunity(this, person, template);

    }
  }
};