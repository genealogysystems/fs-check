/**
 * Returns an opportunity if there is a marriage but no marriage fact,
 * or there is 1 marriage fact with no date and place
 */
var utils = require('../util.js');

module.exports = function(wife, husband, marriage) {

  var person = wife,
      spouse = husband;
  if(!person) {
    person = husband;
    spouse = undefined;
  }

  // If we have more than one marriage fact, don't run
  var facts = marriage.$getFacts(),
      count = 0;
  for(var x in facts) {
    if(facts[x].type == 'http://gedcomx.org/Marriage') {
      count++;
    }
  }

  if(count > 1) {
    return;
  }

  // End if we have a marriage date or place
  var marriageFact = marriage.$getMarriageFact();
  if(marriageFact && (utils.getFactYear(marriageFact) !== undefined || utils.getFactPlace(marriageFact) !== undefined)){
    return;
  }

  var descr = utils.markdown(function(){/*
    Start with a general search in some of the popular online repositories.
    Finding a census can give you an approximate date by looking at the age of the oldest child, which would allow you to narrow your search further.
    Once you have found information about the marriage, update the [couple's relationship](https://familysearch.org/tree/#view=coupleRelationship&relationshipId={{crid}}).

    ## Help

    * [Adding a marriage date to the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
  */}, {crid: marriage.id});

  var opportunity = {
    type: 'family',
    title: 'Find a Marriage',
    description: descr,
    person: person,
    findarecord: undefined,
    gensearch: {
      givenName: person.$getGivenName(),
      familyName: person.$getSurname()
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

  return opportunity;

}