/**
 * Returns an opportunity if:
 *  1. Person has one or more marriages
 *  2. Person has no children
 */
var utils = require('../util.js');

module.exports = function(person, relationships, people) {

  if(relationships.getSpouseIds().length == 0) {
    return;
  }


  if(relationships.getChildIds().length == 0) {

    var descr = utils.markdown(function(){/*
        Usually a person who is married has at least one child.
        Go to [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}) to correct this.

        ## Help
    
        * [Correcting information in the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
      */}, {
        pid:  person.id
      });

    var opportunity = {
      type: 'problem',
      title: 'Marriage with no Children',
      description: descr,
      person: person,
      findarecord: undefined,
      gensearch: undefined
    };

    return opportunity;

  }
}