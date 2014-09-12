/**
 * Returns an opportunity if:
 *  1. There is a death fact
 *  2. There is an original date
 *  3. There is no formal date
 */
var utils = require('../util.js');

module.exports = {
  id: 'standardizeDeathDate',
  type: 'cleanup',
  title: 'Standardize a Death Date',
  signature: 'person',
  check: function(person) {

    var death = person.$getDeath();

    // If we have no death return
    if(!death) {
      return;
    }

    // If we have an original date without a formal date
    if(death.$getDate() !== undefined && death.$getNormalizedDate() === undefined) {

      var descr = utils.markdown(function(){/*
        [{{name}}'s](https://familysearch.org/tree/#view=ancestor&person={{pid}}) death date of `{{date}}` has not been standardized.

        ## Why?
        Standardization ensures that everyone knows when this event took place.
        Because there are many date formats used accross the world, it may not always be obvious what the date actually is.
        Take `3/11/2000` for example. Is this March 11, 2000 or November 3, 2000?
        By standardizing the date we can avoid this confusion.
        Read a guide from FamilySearch about [standardizing dates and places](https://familysearch.org/ask/productSupport#/Entering-Standardized-Dates-and-Places).
      */}, {
        pid: person.id,
        name: person.$getDisplayName(),
        date: death.$getDate()
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