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