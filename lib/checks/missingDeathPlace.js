/**
 * Returns an opportunity if:
 *  1. There is a death fact
 *  2. There is no place
 *  3. There is a date
 */
var utils = require('../util.js');

module.exports = {
  id: 'missingDeathPlace',
  type: 'person',
  title: 'Find a Death Place',
  signature: 'person',
  check: function(person) {

    var death = person.$getDeath();

    if(!death) {
      return;
    }

    // If we already have a death place
    if(utils.getFactPlace(death) !== undefined) {
      return;
    }

    var year = utils.getFactYear(death)

    // If we don't have a date AND place, then we count it as not having a death
    if(year === undefined) {
      return;
    }

    var descr = utils.markdown(function(){/*
        Start with a general search in some of the popular online repositories.
        Once you have found a record with a death place, go to [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}) and enter it.

        ## Help
    
        * [Adding a death place to the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
      */}, {pid:  person.id});

    return {
      id: this.id + ':' + person.id,
      type: this.type,
      title: this.title,
      description: descr,
      person: person,
      findarecord: undefined,
      gensearch: utils.gensearchPerson(person)
    };

  }
};