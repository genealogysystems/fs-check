/**
 * Returns an opportunity if:
 *  1. Person has more than one parent relationship
 */
var utils = require('../util.js');

module.exports = {
  id: 'multipleParents',
  type: 'cleanup',
  title: 'Multiple Parent Relationships',
  signature: 'relationships',
  check: function(person, relationships, people) {

    var parentRelationships = relationships.getParentRelationships();
  
    if(parentRelationships.length < 2) {
      return;
    }
    
    var biologicalFathers = 0,
        biologicalMothers = 0;
    
    // For each parent, begin by assuming they are biological.
    // We do this because a large percentage of parent relationships
    // do not have type specified.   
    for(var i = 0; i < parentRelationships.length; i++){
      var relationship = parentRelationships[i],
          fatherFacts = relationship.$getFatherFacts(),
          motherFacts = relationship.$getMotherFacts(),
          biologicalFather = true,
          biologicalMother = true;
      for(var j = 0; biologicalFather && j < fatherFacts.length; j++){
        if(fatherFacts[j].type !== 'http://gedcomx.org/BiologicalParent'){
          biologicalFather = false;
        }
      }
      for(var j = 0; biologicalMother && j < motherFacts.length; j++){
        if(motherFacts[j].type !== 'http://gedcomx.org/BiologicalParent'){
          biologicalMother = false;
        }
      }
      if(biologicalFather){
        biologicalFathers++;
      }
      if(biologicalMother){
        biologicalMothers++;
      }
    }
    
    if(biologicalFathers < 2 && biologicalMothers < 2){
      return;
    }

    var descr = utils.markdown(function(){/*
        {{name}} is listed as having multiple biological parents, which is highly improbable.
        Visit [{{name}}](https://familysearch.org/tree/#view=ancestor&person={{pid}}) in the Family Tree to correct this.

        ## Help
        
        * [Correcting information in the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
      */}, {
        pid:  person.id,
        name: person.$getDisplayName()
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