/**
 * Returns an opportunity if:
 *  1. There is a wife OR husband
 *  2. There is only 1 marriage fact
 *  3. There is an original place
 *  4. There is no normalized place
 */
var utils = require('../util.js');

module.exports = function(wife, husband, marriage) {

  var person = wife,
      spouse = husband;
  if(!person) {
    person = husband;
    spouse = undefined;
  }
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

    var coupleDescr = '';
    if(wife && husband) {
      coupleDescr = 'between ' + wife.$getDisplayName() + ' and ' + husband.$getDisplayName();
    } else {
      coupleDescr = 'for ' + person.$getDisplayName();
    }

    var descr = utils.markdown(function(){/*
      Go to [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}) and standardize the Marriage Place {{couple}}.

      ## Why?
      Standardization ensures that everyone knows where this event took place.
      Because there are many different ways to spell or qualify a place, it may not always be obvious where that place actually is.
      Take `London` for example.
      Is this London England, London Kentucky, or London Ontario?
      By standardizing the place we can avoid this confusion.

      ## How?
      View the [FamilySearch Guide](https://familysearch.org/ask/productSupport#/Entering-Standardized-Dates-and-Places).

    */}, {pid:  person.id, couple: coupleDescr});

    return {
      type: 'cleanup',
      title: 'Standardize a Marriage Place',
      description: descr,
      person: person,
      findarecord: undefined,
      gensearch: undefined
    };
  }
}