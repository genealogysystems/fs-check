/**
 * Returns an opportunity if:
 *  1. Person has one or more marriages
 *  2. Person has no children
 */
var utils = require('../util.js');

module.exports = {
  id: 'marriageWithNoChildren',
  type: 'family',
  signature: 'relationships',
  help: [],
  check: function(person, relationships, people) {

    var allSpouseIds = relationships.getSpouseIds(),
        spouseIdsWithoutChildren = [];
  
    if(allSpouseIds.length == 0) {
      return;
    }
    
    for(var i = 0; i < allSpouseIds.length; i++){
      if(relationships.getChildRelationshipsOf(allSpouseIds[i]).length === 0){
        spouseIdsWithoutChildren.push(allSpouseIds[i]);
      }
    }

    if(spouseIdsWithoutChildren.length > 0) {

      var spouses = [];
      for(var i = 0; i < spouseIdsWithoutChildren.length; i++){
        spouses.push({
          id: relationships.getSpouseRelationship(spouseIdsWithoutChildren[i]).id,
          name: people[spouseIdsWithoutChildren[i]].$getDisplayName()
        });
      }
      
      var template = {
        pid:  person.id,
        name: person.$getDisplayName(),
        multipleSpouses: spouses.length > 1,
        spouse: spouses[0],
        spouses: spouses
      };

      return utils.createOpportunity(this, person, template);

    }
  }
};