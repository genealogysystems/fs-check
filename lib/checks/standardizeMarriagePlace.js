/**
 * Returns an opportunity if:
 *  1. There is a wife OR husband
 *  2. There is only 1 marriage fact
 *  3. There is an original place
 *  4. There is no normalized place
 */
var utils = require('../util.js');

module.exports = {
  id: 'standardizeMarriagePlace',
  type: 'cleanup',
  title: 'Standardize a Marriage Place',
  signature: 'marriage',
  check: function(wife, husband, marriage) {

    var person = wife,
        spouse = husband;

    if(!person) {
      return;
    }

    var marriageFact = marriage.$getMarriageFact();

    // If we don't have exactly one marriage fact, don't run
    var facts = marriage.$getFacts(),
        count = 0;
    for(var x in facts) {
      if(facts[x].type == 'http://gedcomx.org/Marriage') {
        count++;
      }
    }

    if(count != 1) {
      return;
    }

    // If we have an original place without a normalized place
    if(marriageFact.$getPlace() !== undefined && marriageFact.$getNormalizedPlace() === undefined) {

      var descr = utils.markdown(function(){/*
        The marriage place of `{{place}}` has not been standardized for the marriage between
        [{{wifeName}} and {{husbandName}}](https://familysearch.org/tree/#view=coupleRelationship&relationshipId={{crid}}). 

        ## Why?
        Standardization ensures that everyone knows where this event took place.
        Because there are many different ways to spell or qualify a place, it may not always be obvious where that place actually is.
        Take `London` for example. Is this the London in England, Kentucky, or Ontario?
        By standardizing the place we can avoid this confusion.
        Read a guide from FamilySearch about [standardizing dates and places](https://familysearch.org/ask/productSupport#/Entering-Standardized-Dates-and-Places).

      */}, {
        crid: marriage.id,
        wifeName: wife.$getDisplayName(),
        husbandName: husband.$getDisplayName(),
        place: marriageFact.$getPlace()
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
  }
};