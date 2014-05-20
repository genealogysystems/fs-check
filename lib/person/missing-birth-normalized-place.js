/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is an original place
 *  3. There is no normalized place
 */
var utils = require('../util.js');

module.exports = function(person) {

  var birth = person.$getBirth();

  // If we have no birth return
  if(!birth) {
    return;
  }

  // If we have an original place without a normalized place
  if(birth.$getPlace() !== undefined && birth.$getNormalizedPlace() === undefined) {

    var descr = utils.markdown(function(){/*
      Go to [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}) and standardize the Birth Place.

      ## Why?
      Standardization ensures that everyone knows where this event took place.
      Because there are many different ways to spell or qualify a place, it may not always be obvious where that place actually is.
      Take `London` for example.
      Is this London England, London Kentucky, or London Ontario?
      By standardizing the place we can avoid this confusion.

      ## How?
      Video Tutorial Coming Soon!

    */}, {pid:  person.id});

    return {
      type: 'cleanup',
      title: 'Standardize a Birth Place',
      description: descr,
      person: person,
      findarecord: undefined,
      gensearch: undefined
    };
  }
}