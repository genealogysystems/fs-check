/**
 * Returns an opportunity if:
 *  1. There is more than one marriage fact
 */
var utils = require('../util.js');

module.exports = {
  id: 'multipleMarriageFacts',
  type: 'cleanup',
  title: 'Multiple Marriage Facts',
  signature: 'marriage',
  check: function(wife, husband, marriage) {

    var person = wife,
        spouse = husband;

    if(!person) {
      return;
    }

    // If we have more than one marriage fact, don't run
    var facts = marriage.$getFacts(),
        count = 0;
    for(var x in facts) {
      if(facts[x].type === 'http://gedcomx.org/Marriage') {
        count++;
      }
    }

    if(count < 2) {
      return;
    }
    
    var coupleDescr = wife.$getDisplayName() + ' and ' + husband.$getDisplayName();

    var descr = utils.markdown(function(){/*
      The marriage between [{{couple}}](https://familysearch.org/tree/#view=coupleRelationship&relationshipId={{crid}})
      has multiple marriage events. This is only possible in the unlikely situation where the couple 
      remarried after divorcing. Try to merge similar information and reduce the events down to just one.
      View their [relationship](https://familysearch.org/tree/#view=coupleRelationship&relationshipId={{crid}})
      in the Family Tree to correct this problem.

      ## Help

      * [Removing Marriage Facts in the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
    */}, {crid:  marriage.id, couple: coupleDescr});

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