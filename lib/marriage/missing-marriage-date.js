/**
 * Returns an opportunity if:
 *  1. There is a wife OR husband
 *  2. There is only 1 marriage fact
 *  3. There is a place
 */
var utils = require('../util.js');

module.exports = function(wife, husband, marriage) {

  var marriageFact = marriage.$getMarriageFact();

  if(!marriageFact) {
    return;
  }

  var person = wife,
      spouse = husband;
  if(!person) {
    person = husband;
    spouse = undefined;
  }
  if(!person) {
    return;
  }

  // If we have more than one marriage fact, don't run
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

  // If we already have a marriage date
  if(utils.getFactYear(marriageFact) !== undefined) {
    return;
  }

  var place = utils.getFactPlace(marriageFact)

  // If we don't have a date AND place, then we count it as not having a marriage
  if(place === undefined) {
    return;
  }

  var coupleDescr = '';
  if(wife && husband) {
    coupleDescr = 'between ' + wife.$getDisplayName() + ' and ' + husband.$getDisplayName();
  } else {
    coupleDescr = 'for ' + person.$getDisplayName();
  }

  var descr = utils.markdown(function(){/*
    Start with a general search in some of the popular online repositories.
    Finding a census can give you an approximate date by looking at the age of the oldest child, which would allow you to narrow your search further.
    Once you have found a record with a marriage date, go to [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}) and enter it.

    ## Help

    * [Adding a marriage date to the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
  */}, {pid:  person.id});

  var opportunity = {
    type: 'family',
    title: 'Find a Marriage Date',
    description: descr,
    person: person,
    findarecord: undefined,
    gensearch: {
      givenName: person.$getGivenName(),
      familyName: person.$getSurname(),
      marriagePlace: place
    }
  };

  if(spouse !== undefined) {
    opportunity.gensearch.spouseGivenName = spouse.$getGivenName();
    opportunity.gensearch.spouseFamilyName = spouse.$getSurname();
  }

  var birth = person.$getBirth();
  if(birth !== undefined) {
    opportunity.gensearch.birthPlace = utils.getFactPlace(birth);
    opportunity.gensearch.birthDate = utils.getFactYear(birth)+'';
  }

  var death = person.$getDeath();
  if(death !== undefined) {
    opportunity.gensearch.deathPlace = utils.getFactPlace(death);
    opportunity.gensearch.deathDate = utils.getFactYear(death)+'';
  }

  // TODO enhance the genSearch Object

  return opportunity;

}