/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is an original date
 *  3. There is no formal date
 */
var utils = require('../util.js');

module.exports = function(person) {

  var birth = person.$getBirth();

  // If we have no birth return
  if(!birth) {
    return;
  }

  // If we have an original date without a formal date
  if(birth.$getDate() !== undefined && birth.$getFormalDate() === undefined) {

    var descr = utils.markdown(function(){/*
      Go to [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}) and standardize the Birth Date.

      ## Why?
      Standardization ensures that everyone knows when this event took place.
      Because there are many date formats used accross the world, it may not always be obvious what the date actually is.
      Take `3/11/2000` for example.
      Is this March 11, 2000 or November 3, 2000?
      By standardizing the date we can avoid this confusion.

      ## How?
      Video Tutorial Coming Soon!

    */}, {pid:  person.id});

    return {
      type: 'cleanup',
      title: 'Standardize a Birth Date',
      description: descr,
      person: person,
      findarecord: undefined,
      gensearch: undefined
    };
  }
}