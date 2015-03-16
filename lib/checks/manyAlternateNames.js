/**
 * Returns an opportunity if:
 *  1. There are 5 or more alternate names
 */
var utils = require('../util'),
    help = require('../help');

module.exports = {
  id: 'manyAlternateNames',
  type: 'cleanup',
  signature: 'person',
  help: [ help.links('alreadyInTree','customEvents','correctingInformation') ],
  check: function(person) {

    var names = person.$getNames();

    // Compare to 6 instead of 5 to allow for the preferred name
    if(names && names.length >= 6) {

      var alternates = [];
      for(var i = 0; i < names.length; i++){
        if(!names[i].preferred){
          alternates.push(names[i].$getFullText());
        }
      }

      return {
        id: this.id + ':' + person.id,
        type: this.type,
        checkId: this.id,
        personId: person.id,
        person: person,
        gensearch: undefined,
        template: {
          pid: person.id, 
          names: alternates
        }
      };
    }
  }
};