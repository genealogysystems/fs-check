/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is a birth date
 *  3. There is a death fact
 *  4. There is a death date
 */
var utils = require('../util.js');

module.exports = {
  id: 'deathBeforeBirth',
  type: 'problem',
  title: 'Person Died Before They Were Born',
  signature: 'person',
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
      if(utils.getFactYear(death) >= utils.getFactYear(birth)) {
        return;
      }
    }
    
    // If they both have formal values then do an exact comparison
    else if(utils.compareFormalDates(birth.$getFormalDate(), death.$getFormalDate()) !== 1) {
      return;
    }

    var descr = utils.markdown(function(){/*
        A person cannot die before they were born. Visit [{{name}}](https://familysearch.org/tree/#view=ancestor&person={{pid}})
        in the Family Tree and fix the issue by doing one of the following:
        
        * Change the birth date to be before the death date
        * Change the death date to be after the birth date

        ## Help
    
        * [Correcting information in the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
        * [Explaining approximate birth dates](https://familysearch.org/ask/productSupport#/Do-not-know-exact-birth-date-or-death-date)
      */}, {
        pid: person.id,
        name: person.display.name
      });

    return {
      id: this.id + ':' + person.id,
      type: this.type,
      title: this.title,
      description: descr,
      person: person,
      findarecord: undefined,
      gensearch: undefined
    };
  }
};