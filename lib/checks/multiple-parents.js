/**
 * Returns an opportunity if:
 *  1. Person has more than one parent relationship
 */
var utils = require('../util.js');

module.exports = function(person, relationships, people) {

  if(relationships.getParentRelationships().length < 2) {
    return;
  }

  var descr = utils.markdown(function(){/*
      A person usually only has one set of parents.
      If needed, go to [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}) to correct this.

      ## Help
  
      * [Correcting information in the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
    */}, {
      pid:  person.id
    });

  var opportunity = {
    type: 'cleanup',
    title: 'Multiple Parent Relationships',
    description: descr,
    person: person,
    findarecord: undefined,
    gensearch: undefined
  };

  return opportunity;

}