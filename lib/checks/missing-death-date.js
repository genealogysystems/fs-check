/**
 * Returns an opportunity if:
 *  1. There is a death fact
 *  2. There is no date
 *  3. There is a place
 */
var utils = require('../util.js');

module.exports = function(person) {

  var death = person.$getDeath();

  if(!death) {
    return;
  }

  // If we already have a death date
  if(utils.getFactYear(death) !== undefined) {
    return;
  }

  var place = utils.getFactPlace(death)

  // If we don't have a date AND place, then we count it as not having a death
  if(place === undefined) {
    return;
  }

  var descr = utils.markdown(function(){/*
      Start with a general search in some of the popular online repositories.
      Once you have found a record with a death date, go to [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}) and enter it.

      ## Help
  
      * [Adding a death date to the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
      * [Explaining approximate death dates](https://familysearch.org/ask/productSupport#/Do-not-know-exact-birth-date-or-death-date)
    */}, {pid:  person.id});

  var opportunity = {
    type: 'person',
    title: 'Find a Death Date',
    description: descr,
    person: person,
    findarecord: undefined,
    gensearch: {
      givenName: person.$getGivenName(),
      familyName: person.$getSurname(),
      deathPlace: place
    }
  };

  var birth = person.$getBirth();
  if(birth !== undefined) {
    opportunity.gensearch.birthPlace = utils.getFactPlace(birth);
    opportunity.gensearch.birthDate = utils.getFactYear(birth)+'';
  }

  // TODO enhance the genSearch Object

  return opportunity;

}