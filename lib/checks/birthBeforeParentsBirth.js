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
  help: ['nonexactDates','addingAndCorrecting'],
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
        
    if(!birth || !birth.date) {
      return;
    }
    
    var birthFormal = utils.getFormalDate(birth);
    
    if(!birthFormal){
      return;
    }
    
    for(var i = 0; i < parents.length; i++){
      var parentBirth = parents[i].$getBirth();
      if(parentBirth){
        var parentBirthDate = utils.getFormalDate(parentBirth);
        if(parentBirthDate && utils.compareFormalDates(birthFormal, parentBirthDate) === -1){
          addParent(parents[i]);
        }
      }
    }

    if(birthBeforeParentBirth.length > 0) {
      var template = {
        pid:  person.id,
        personName: person.$getDisplayName(),
        personBirth: person.$getDisplayBirthDate(),
        parents: birthBeforeParentBirth
      };
      return utils.createOpportunity(this, person, template);
    }
  }
}