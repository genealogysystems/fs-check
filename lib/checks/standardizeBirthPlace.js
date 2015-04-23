/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is an original place
 *  3. There is no normalized place
 */
var utils = require('../util'),
    help = require('../help');

module.exports = {
  id: 'standardizeBirthPlace',
  type: 'cleanup',
  signature: 'person',
  help: ['standardizing'],
  check: function(person) {

    var birth = person.$getBirth();

    // If we have no birth return
    if(!birth) {
      return;
    }

    // If we have an original place without a normalized place
    if(birth.$getPlace() !== undefined && birth.$getNormalizedPlace() === undefined) {

      var template = {
        pid: person.id,
        name: person.$getDisplayName(),
        place: birth.$getPlace()
      };
  
      return utils.createOpportunity(this, person, template);

    }
  }
};