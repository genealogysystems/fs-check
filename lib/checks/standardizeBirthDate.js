/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is an original date
 *  3. There is no formal date
 */
var utils = require('../util'),
    help = require('../help');

module.exports = {
  id: 'standardizeBirthDate',
  type: 'cleanup',
  signature: 'person',
  help: help.links('standardizing'),
  check: function(person) {

    var birth = person.$getBirth();

    // If we have no birth return
    if(!birth) {
      return;
    }

    // If we have an original date without a formal date
    if(birth.$getDate() !== undefined && birth.$getNormalizedDate() === undefined) {
      
      var template = {
        pid: person.id,
        name: person.$getDisplayName(),
        date: birth.$getDate()
      };
  
      return utils.createOpportunity(this, person, template);

    }
  }
};