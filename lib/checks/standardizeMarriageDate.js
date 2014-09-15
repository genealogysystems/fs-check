/**
 * Returns an opportunity if:
 *  1. There is a wife OR husband
 *  2. There is only 1 marriage fact
 *  3. There is an original date
 *  4. There is no formal date
 */
var utils = require('../util.js');

module.exports = {
  id: 'standardizeMarriageDate',
  type: 'cleanup',
  title: 'Standardize a Marriage Date',
  signature: 'marriage',
  check: function(wife, husband, marriage) {

    if(!wife || !husband){
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

    // If we have an original date without a formal date
    if(marriageFact.$getDate() !== undefined && marriageFact.$getNormalizedDate() === undefined) {

      var descr = utils.markdown(function(){/*
        The marriage date of `{{date}}` has not been standardized for the marriage between
        [{{wifeName}} and {{husbandName}}](https://familysearch.org/tree/#view=coupleRelationship&relationshipId={{crid}}).

        ## Why?
        Standardization ensures that everyone knows when this event took place.
        Because there are many date formats used accross the world, it may not always be obvious what the date actually is.
        Take `3/11/2000` for example. Is this March 11, 2000 or November 3, 2000?
        By standardizing the date we can avoid this confusion.
        Read a guide from FamilySearch about [standardizing dates and places](https://familysearch.org/ask/productSupport#/Entering-Standardized-Dates-and-Places).
      */}, {
        crid: marriage.id, 
        wifeName: wife.$getDisplayName(),
        husbandName: husband.$getDisplayName(),
        date: facts[0].$getDate()
      });

      return {
        id: this.id + ':' + wife.id,
        type: this.type,
        title: this.title,
        description: descr,
        person: wife,
        findarecord: undefined,
        gensearch: undefined
      };
    }
  }
};