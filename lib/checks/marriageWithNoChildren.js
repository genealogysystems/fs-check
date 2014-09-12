/**
 * Returns an opportunity if:
 *  1. Person has one or more marriages
 *  2. Person has no children
 */
var utils = require('../util.js');

module.exports = {
  id: 'marriageWithNoChildren',
  type: 'problem',
  title: 'Marriage with no Children',
  signature: 'relationships',
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
          name: relationships.getPerson(spouseIdsWithoutChildren[i]).$getDisplayName()
        });
      }
    
      var descr = utils.markdown(function(){/*
          {{^multipleSpouses}}
          The marriage between [{{name}}](https://familysearch.org/tree/#view=ancestor&person={{pid}})
          and [{{spouse.name}}](https://familysearch.org/tree/#view=ancestor&person={{spouse.id}}) has no children. Though this is possible it still represents
          an opportunity for research until you are confident that the couple had no children.
          {{/multipleSpouses}}
          {{#multipleSpouses}}
          [{{name}}](https://familysearch.org/tree/#view=ancestor&person={{pid}}) has multiple marriages
          with no children. Though this is possible it still represents an opportunity for research 
          until you are confident that the couples had no children.
          
          {{#spouses}}
          * [{{name}}](https://familysearch.org/tree/#view=ancestor&person={{id}})
          {{/spouses}}
          {{/multipleSpouses}}
        */}, {
          pid:  person.id,
          name: person.$getDisplayName(),
          multipleSpouses: spouses.length > 1,
          spouse: spouses[0],
          spouses: spouses
        });

      var opportunity = {
        id: this.id + ':' + person.id,
        type: this.type,
        title: this.title,
        description: descr,
        person: person,
        findarecord: undefined,
        gensearch: undefined
      };

      return opportunity;

    }
  }
};