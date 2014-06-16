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
      person = husband;
      spouse = undefined;
    }
    if(!person) {
      return;
    }

    // If we have more than one marriage fact, don't run
    var facts = marriage.$getFacts(),
        count = 0;
    for(var x in facts) {
      if(facts[x].type == 'http://gedcomx.org/Marriage') {
        count++;
      }
    }

    if(count < 2) {
      return;
    }


    var coupleDescr = '';
    if(wife && husband) {
      coupleDescr = 'between ' + wife.$getDisplayName() + ' and ' + husband.$getDisplayName();
    } else {
      coupleDescr = 'for ' + person.$getDisplayName();
    }

    var descr = utils.markdown(function(){/*
      The marriage {{couple}} has multiple marriage facts associated with it.
      This is unusual, and should be investigated.
      Try to merge like information and reduce them down to one marriage fact.
      View the relationship in [FamilySearch](https://familysearch.org/tree/#view=coupleRelationship&relationshipId={{crid}}) to correct this problem.

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