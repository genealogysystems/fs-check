/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is no place
 *  3. There is a date
 */
var utils = require('../util.js');

module.exports = {
  id: 'missingBirthPlace',
  type: 'person',
  title: 'Find a Birth Place',
  signature: 'person',
  check: function(person) {

    var birth = person.$getBirth();

    if(!birth) {
      return;
    }

    // If we already have a birth place
    if(utils.getFactPlace(birth) !== undefined) {
      return;
    }

    var year = utils.getFactYear(birth)

    // If we don't have a date AND place, then we count it as not having a birth
    if(year === undefined) {
      return;
    }

    // TODO if they have a christening record, change the description

    var descr = utils.markdown(function(){/*
        Start with a general search in some of the popular online repositories.
        Finding a census can give you an approximate place, which would allow you to narrow your search further.
        Once you have found a record with a birth place, go to [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}) and enter it.

        ## Help
    
        * [Adding a birth place to the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
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