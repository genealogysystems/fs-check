/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is a birth date
 *  3. There is a death fact
 *  4. There is a death date
 */
var utils = require('../util'),
    help = require('../help');

module.exports = {
  id: 'deathBeforeBirth',
  type: 'problem',
  signature: 'person',
  help: [ help.links('correctingInformation', 'nonexactDates') ],
  check: function(person) {

    var birth = person.$getBirth(),
        death = person.$getDeath();

    // If we don't have a birth
    if(!birth || !birth.date) {
      return;
    }
    
    // If we don't have a death
    if(!death || !death.date) {
      return;
    }

    // If either the birth or death date doesn't
    // have a formal value then we just compare years
    if(!birth.$getFormalDate() || !death.$getFormalDate()){
      var birthYear = utils.getFactYear(birth),
          deathYear = utils.getFactYear(death);
      if(!birthYear || !deathYear || birthYear <= deathYear) {
        return;
      }
    }
    
    // If they both have formal values then do an exact comparison
    else {
      var birthFormal = utils.getFormalDate(birth),
          deathFormal = utils.getFormalDate(death);
      if(utils.compareFormalDates(birthFormal, deathFormal) !== 1) {
        return;
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
        name: person.$getDisplayName()
      }
    };
  }
};