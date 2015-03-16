/**
 * Returns an opportunity if:
 *  1. There is a death fact
 *  2. There is no place
 *  3. There is a date
 */
var utils = require('../util.js');

module.exports = {
  id: 'missingDeathPlace',
  type: 'person',
  signature: 'person',
  help: [],
  check: function(person) {

    var death = person.$getDeath();

    if(!death) {
      return;
    }

    // If we already have a death place
    if(utils.getFactPlace(death) !== undefined) {
      return;
    }

    var year = utils.getFactYear(death)

    // If we don't have a date AND place, then we count it as not having a death
    if(year === undefined) {
      return;
    }

    var template = {
      name: person.$getDisplayName(),
      pid:  person.id
    };

    return utils.createOpportunity(this, person, template, utils.gensearchPerson(person));

  }
};