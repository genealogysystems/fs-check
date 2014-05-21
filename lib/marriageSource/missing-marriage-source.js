/**
 * Returns an opportunity if:
 *  1. Marriage fact exists
 *  2. There is a husband or a wife
 *  2. There is only one marriage fact
 *  3. Marriage has a place
 *  4. Marriage has a date
 *  5. SourceRefs is empty
 */
var utils = require('../util.js');

module.exports = function(wife, husband, marriage, sourceRefs) {

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

  var marriageYear = utils.getFactYear(marriageFact),
      marriagePlace = utils.getFactPlace(marriageFact);

  // If we don't have a mrriage date or place
  if(marriageYear == undefined || marriagePlace == undefined) {
    return;
  }

  if(sourceRefs.length > 0) {
    return;
  }

  var coupleDescr = '';
  if(wife && husband) {
    coupleDescr = 'between ' + wife.$getDisplayName() + ' and ' + husband.$getDisplayName();
  } else {
    coupleDescr = 'for ' + person.$getDisplayName();
  }

  var descr = utils.markdown(function(){/*
      You are looking for a marriage {{couple}}.
      Start by searching collections containing Marriage records for the place and time you are looking for.
      If you haven't found a record in any of those collections, try expanding your search to some of the popular online repositories.
      If you still haven't found it, try using Find-A-Record to look for collections that are not available online (like microfilm).
      Once you have found a record of the marriage, go to [FamilySearch](https://familysearch.org/tree/#view=coupleRelationship&relationshipId={{mid}}) and enter it as a source.

      ## Help
  
      * [Adding a source to the Family Tree](https://familysearch.org/ask/productSupport#/Attaching-Sources-to-People-and-Relationships)
    */}, {mid:  marriage.id, couple: coupleDescr});

  var opportunity = {
    type: 'source',
    title: 'Find a Marriage Record',
    description: descr,
    person: person,
    findarecord: {
        tags: ['marriage'],
        from: (marriageYear)? marriageYear-10:undefined,
        to: (marriageYear)? marriageYear+10:undefined,
        place: marriagePlace
      },
    gensearch: {
      givenName: person.$getGivenName(),
      familyName: person.$getSurname(),
      marriageDate: marriageYear+'',
      marriagePlace: marriagePlace
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