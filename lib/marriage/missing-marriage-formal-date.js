/**
 * Returns an opportunity if:
 *  1. There is a wife OR husband
 *  2. There is only 1 marriage fact
 *  3. There is an original date
 *  4. There is no formal date
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

  // If we have an original date without a formal date
  if(marriageFact.$getDate() !== undefined && marriageFact.$getFormalDate() === undefined) {

    var coupleDescr = '';
    if(wife && husband) {
      coupleDescr = 'between ' + wife.$getDisplayName() + ' and ' + husband.$getDisplayName();
    } else {
      coupleDescr = 'for ' + person.$getDisplayName();
    }

    var descr = utils.markdown(function(){/*
      Go to [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}) and standardize the Marriage Date {{couple}}.

      ## Why?
      Standardization ensures that everyone knows when this event took place.
      Because there are many date formats used accross the world, it may not always be obvious what the date actually is.
      Take `3/11/2000` for example.
      Is this March 11, 2000 or November 3, 2000?
      By standardizing the date we can avoid this confusion.

      ## How?
      View the [FamilySearch Guide](https://familysearch.org/ask/productSupport#/Entering-Standardized-Dates-and-Places).

    */}, {pid:  person.id, couple: coupleDescr});

    return {
      type: 'cleanup',
      title: 'Standardize a Marriage Date',
      description: 'Go to FamilySearch and enter a formal date for this marriage.',
      person: person,
      findarecord: undefined,
      gensearch: undefined
    };
  }
}