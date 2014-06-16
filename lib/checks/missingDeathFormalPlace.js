/**
 * Returns an opportunity if:
 *  1. There is a death fact
 *  2. There is an original place
 *  3. There is no normalized place
 */
var utils = require('../util.js');

module.exports = {
  id: 'missingDeathFormalPlace',
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
        Go to [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}) and standardize the Death Place.

        ## Why?
        Standardization ensures that everyone knows where this event took place.
        Because there are many different ways to spell or qualify a place, it may not always be obvious where that place actually is.
        Take `London` for example.
        Is this London England, London Kentucky, or London Ontario?
        By standardizing the place we can avoid this confusion.

        ## How?
        View the [FamilySearch Guide](https://familysearch.org/ask/productSupport#/Entering-Standardized-Dates-and-Places).

      */}, {pid:  person.id});

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