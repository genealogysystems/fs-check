/**
 * Returns an opportunity if:
 *  1. There is a wife OR husband
 *  2. There is only 1 marriage fact
 *  3. There is a date
 */
var utils = require('../util.js');

module.exports = {
  id: 'missingMarriagePlace',
  type: 'family',
  title: 'Find a Marriage Place',
  signature: 'marriage',
  check: function(wife, husband, marriage) {

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

    // If we already have a marriage place
    if(utils.getFactPlace(marriageFact) !== undefined) {
      return;
    }

    var date = utils.getFactYear(marriageFact)

    // If we don't have a date AND place, then we count it as not having a marriage
    if(date === undefined) {
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
      Once you have found a record with a marriage date, add it in [FamilySearch](https://familysearch.org/tree/#view=coupleRelationship&relationshipId={{crid}}).

      ## Help

      * [Adding a marriage place to the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
    */}, {crid:  marriage.id});

    var opportunity = {
      id: this.id + ':' + person.id,
      type: this.type,
      title: this.title,
      description: descr,
      person: person,
      findarecord: undefined,
      gensearch: utils.gensearchPerson(person)
    };
    
    opportunity.gensearch.marriageDate = date+'';

    if(spouse !== undefined) {
      opportunity.gensearch.spouseGivenName = spouse.$getGivenName();
      opportunity.gensearch.spouseFamilyName = spouse.$getSurname();
    }

    return opportunity;

  }
};