/**
 * Returns an opportunity if:
 *  1. Person has more than one parent relationship
 */
var utils = require('../util'),
    help = require('../help');

module.exports = {
  id: 'multipleParents',
  type: 'family',
  signature: 'relationships',
  help: ['addingAndCorrecting'],
  check: function(person, relationships, people) {

    var parentRelationships = relationships.getParentRelationships();
  
    if(parentRelationships.length < 2) {
      return;
    }
    
    var biologicalParentIds = {};
    
    for(var i = 0; i < parentRelationships.length; i++){
      var relationship = parentRelationships[i],
          fatherId = relationship.$getFatherId(),
          motherId = relationship.$getMotherId(),
          fatherFacts = relationship.$getFatherFacts(),
          motherFacts = relationship.$getMotherFacts();
      if(fatherId && fatherFacts){
        for(var j = 0; j < fatherFacts.length; j++){
          if(fatherFacts[j].type === 'http://gedcomx.org/BiologicalParent'){
            biologicalParentIds[fatherId] = true;
          }
        }
      }
      if(motherId && motherFacts){
        for(var j = 0; j < motherFacts.length; j++){
          if(motherFacts[j].type === 'http://gedcomx.org/BiologicalParent'){
            biologicalParentIds[motherId] = true;
          }
        }
      }
    }
    
    if(Object.keys(biologicalParentIds).length > 2){
      var template = {
        name: person.$getDisplayName(),
        pid:  person.id
      };
      return utils.createOpportunity(this, person, template);
    }
  }
};