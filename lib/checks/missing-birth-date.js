/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is no date
 *  3. There is a place
 */
var utils = require('../util.js');

module.exports = function(person) {

  var birth = person.$getBirth();

  if(!birth) {
    return;
  }

  // If we already have a birth date
  if(utils.getFactYear(birth) !== undefined) {
    return;
  }

  var place = utils.getFactPlace(birth)

  // If we don't have a date AND place, then we count it as not having a birth
  if(place === undefined) {
    return;
  }

  // TODO if they have a christening record, change the description

  var descr = utils.markdown(function(){/*
      Start with a general search in some of the popular online repositories.
      Finding a census can give you an approximate date, which would allow you to narrow your search further.
      Once you have found a record with a birth date, go to [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}) and enter it.

      ## Help
  
      * [Adding a birth date to the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
      * [Explaining approximate birth dates](https://familysearch.org/ask/productSupport#/Do-not-know-exact-birth-date-or-death-date)
    */}, {pid:  person.id});

  var opportunity = {
    type: 'person',
    title: 'Find a Birth Date',
    description: descr,
    person: person,
    findarecord: undefined,
    gensearch: {
      givenName: person.$getGivenName(),
      familyName: person.$getSurname(),
      birthPlace: place
    }
  };

  var death = person.$getDeath();
  if(death !== undefined) {
    opportunity.gensearch.deathPlace = utils.getFactPlace(death);
    opportunity.gensearch.deathDate = utils.getFactYear(death)+'';
  }

  // TODO enhance the genSearch Object

  return opportunity;

}