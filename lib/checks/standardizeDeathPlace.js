/**
 * Returns an opportunity if:
 *  1. There is a death fact
 *  2. There is an original place
 *  3. There is no normalized place
 */
var utils = require('../util.js');

module.exports = {
  id: 'standardizeDeathPlace',
  type: 'cleanup',
  title: 'Standardize a Death Place',
  signature: 'person',
  check: function(person) {

    var death = person.$getDeath();

    // If we have no death return
    if(!death) {
      return;
    }

    // If we have an original place without a normalized place
    if(death.$getPlace() !== undefined && death.$getNormalizedPlace() === undefined) {

      var descr = utils.markdown(function(){/*
        [{{name}}'s](https://familysearch.org/tree/#view=ancestor&person={{pid}}) death place of `{{place}}` has not been standardized.

        ## Why?
        Standardization ensures that everyone knows where this event took place.
        Because there are many different ways to spell or qualify a place, it may not always be obvious where that place actually is.
        Take `London` for example. Is this the London in England, Kentucky, or Ontario?
        By standardizing the place we can avoid this confusion.
        Read a guide from FamilySearch about [standardizing dates and places](https://familysearch.org/ask/productSupport#/Entering-Standardized-Dates-and-Places).
      */}, {
        pid: person.id,
        name: person.$getDisplayName(),
        place: death.$getPlace()
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