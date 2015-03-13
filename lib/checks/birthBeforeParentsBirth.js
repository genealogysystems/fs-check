/**
 * Returns an opportunity if:
 *  1. Person has a birth fact
 *  2. Person has a birth date
 *  3. A Parent has a birth date before Person
 */
var utils = require('../util'),
    help = require('../help');

module.exports = {
  id: 'birthBeforeParentsBirth',
  type: 'problem',
  signature: 'parents',
  help: help.links('nonexactDates','addingAndCorrecting'),
  check: function(person, parents) {

    var birthBeforeParentBirth = [],
        birth = person.$getBirth(),
        addParent = function(parent){
          birthBeforeParentBirth.push({
            id: parent.id,
            name: parent.$getDisplayName(),
            birth: parent.$getDisplayBirthDate()
          });
        };
        
    // If we don't have a birth
    if(!birth || !birth.date) {
      return;
    }
    
    var birthYear = utils.getFactYear(birth);

    // If we don't have a formal date then just compare years
    if(!birth.$getFormalDate()) {
      for(var i = 0; i < parents.length; i++){
        var parentBirth = parents[i].$getBirth();
        if(parentBirth) {
          var parentBirthYear = utils.getFactYear(parentBirth);
          if(parentBirthYear && parentBirthYear >= birthYear) {
            addParent(parents[i]);
          }
        }
      }
    }
    
    // If we have a formal birth date for the person then
    // do an exact comparison if the parents have a formal
    // birth date. If the parents don't have a formal birth
    // date then just compare years
    else {
      for(var i = 0; i < parents.length; i++){
        var parentBirth = parents[i].$getBirth();
        if(parentBirth){
          if(parentBirth.$getFormalDate()){
            if(utils.compareFormalDates(birth.$getFormalDate(), parentBirth.$getFormalDate()) === -1){
              addParent(parents[i]);
            }
          } else {
            var parentBirthYear = utils.getFactYear(parentBirth);
            if(parentBirthYear && parentBirthYear >= birthYear) {
              addParent(parents[i]);
            }
          }
        } 
      }
    }

    if(birthBeforeParentBirth.length > 0) {

      return {
        id: this.id + ':' + person.id,
        type: this.type,
        checkId: this.id,
        personId: person.id,
        person: person,
        gensearch: undefined,
        template: {
          pid:  person.id,
          personName: person.$getDisplayName(),
          personBirth: person.$getDisplayBirthDate(),
          parents: birthBeforeParentBirth
        }
      };
    }
  }
}