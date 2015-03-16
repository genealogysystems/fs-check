/**
 * Returns an opportunity if:
 *  1. There is no death fact OR place and date are both undefined
 */
var utils = require('../util.js');

module.exports = {
  id: 'missingDeath',
  type: 'person',
  signature: 'person',
  help: [],
  check: function(person) {

    var death = person.$getDeath();

    if(death) {
      if(utils.getFactPlace(death) !== undefined || utils.getFactYear(death) !== undefined) {
        return;
      }
    }

    // TODO if they have a christening record, change the description

    var template = {
      name: person.$getDisplayName(),
      pid:  person.id
    };

    return utils.createOpportunity(this, person, template, utils.gensearchPerson(person));

  }
};