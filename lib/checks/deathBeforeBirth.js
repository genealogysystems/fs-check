/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is a birth date
 *  3. There is a death fact
 *  4. There is a death date
 */
var utils = require('../util'),
    GedcomXDate = require('gedcomx-date');

module.exports = {
  id: 'deathBeforeBirth',
  type: 'problem',
  signature: 'person',
  help: ['addingAndCorrecting', 'nonexactDates'],
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
    // have a formal then we just compare years.
    if(!birth.$getFormalDate() || !death.$getFormalDate()){
      var birthYear = utils.getFactYear(birth),
          deathYear = utils.getFactYear(death);
      if(!birthYear || !deathYear || birthYear <= deathYear) {
        return;
      }
    }
    
    // If they both have full formal values then we compare
    else {
      var birthGedx = new GedcomXDate(utils.getFormalDate(birth)),
          deathGedx = new GedcomXDate(utils.getFormalDate(death));
          
      // If the birth date is partial then we make it a full
      // leaning towards the earliest date to avoid false positives
      // For death we lean towards the latest
      utils.ensureFullDate(birthGedx, 1, 1);
      utils.ensureFullDate(deathGedx, 12, 31);
          
      if(utils.compareFormalDates(birthGedx, deathGedx) !== 1) {
        return;
      }
    }
    
    var template = {
      pid: person.id,
      name: person.$getDisplayName()
    };

    return utils.createOpportunity(this, person, template);

  }
};