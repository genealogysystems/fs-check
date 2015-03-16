/**
 * Returns an opportunity if:
 *  1. There is a death fact
 *  2. There is no date
 *  3. There is a place
 */
var utils = require('../util.js');

module.exports = {
  id: 'missingDeathDate',
  type: 'person',
  signature: 'person',
  help: [],
  check: function(person) {

    var death = person.$getDeath();

    if(!death) {
      return;
    }

    if(utils.getFactYear(death) !== undefined) {
      return;
    }

    var place = utils.getFactPlace(death)

    if(place === undefined) {
      return;
    }

    var template = {
      name: person.$getDisplayName(),
      pid:  person.id
    };

    return utils.createOpportunity(this, person, template, utils.gensearchPerson(person));

  }
}