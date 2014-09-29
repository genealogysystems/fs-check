/**
 * Returns an opportunity if:
 *  1. There is a wife OR husband
 *  2. There is only 1 marriage fact
 *  3. There is a place
 */
var utils = require('../util.js');

module.exports = {
  id: 'missingMarriageDate',
  type: 'family',
  title: 'Find a Marriage Date',
  signature: 'marriage',
  check: function(wife, husband, marriage) {

    if(!wife || !husband){
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
    
    var marriageFact = marriage.$getMarriageFact();

    // If we already have a marriage date
    if(utils.getFactYear(marriageFact) !== undefined) {
      return;
    }

    var place = utils.getFactPlace(marriageFact)

    // If we don't have a date AND place, then we count it as not having a marriage
    if(place === undefined) {
      return;
    }
    
    var descr = utils.markdown(function(){/*
      The [marriage](https://familysearch.org/tree/#view=coupleRelationship&relationshipId={{crid}})
      between [{{wifeName}}](https://familysearch.org/tree/#view=allMatchingRecords&person={{wid}}) and [{{husbandName}}](https://familysearch.org/tree/#view=allMatchingRecords&person={{hid}}) has no marriage date. 
      Try these steps to find the marriage date:
        
        1. Review the record hints in FamilySearch for both [{{wifeName}}](https://familysearch.org/tree/#view=allMatchingRecords&person={{wid}}) and [{{husbandName}}](https://familysearch.org/tree/#view=allMatchingRecords&person={{hid}}).
        1. Do broad searches on popular genealogy websites using the links below or using the [RootsSearch](https://chrome.google.com/webstore/detail/rootssearch/aolcffalbhpnojekmimmelebjchjmmgn?hl=en) Chrome Extension.
        1. Ask for help at the [Genealogy and Family History](http://genealogy.stackexchange.com/) Stack Exchange website.
        1. Visit a local [Family History Center](https://familysearch.org/ask/help#localResource).
        1. Hire a researcher from the [Genlighten](http://www.genlighten.com/) community.
    */}, {
      crid: marriage.id,
      wid: wife.id,
      hid: husband.id,
      wifeName: wife.$getDisplayName(),
      husbandName: husband.$getDisplayName()
    });

    var opportunity = {
      id: this.id + ':' + wife.id,
      type: this.type,
      title: this.title,
      description: descr,
      person: wife,
      findarecord: undefined,
      gensearch: utils.gensearchPerson(wife)
    };
    
    opportunity.gensearch.marriagePlace = place;
    opportunity.gensearch.spouseGivenName = husband.$getGivenName();
    opportunity.gensearch.spouseFamilyName = husband.$getSurname();

    return opportunity;

  }
};