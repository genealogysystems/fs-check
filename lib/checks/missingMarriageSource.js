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

module.exports = {
  id: 'missingMarriageSource',
  type: 'source',
  title: 'Find a Marriage Record',
  signature: 'marriageSource',
  check: function(wife, husband, marriage, sourceRefs) {

    var marriageFact = marriage.$getMarriageFact();

    if(!marriageFact) {
      return;
    }

    var person = wife,
        spouse = husband;

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
    
    var findarecord = {
      tags: ['marriage'],
      from: marriageYear ? marriageYear - 3 : undefined,
      to: marriageYear ? marriageYear + 3 : undefined,
      place: marriagePlace
    };

    var descr = utils.markdown(function(){/*
        Follow these steps to find a marriage record for [{{couple}}](https://familysearch.org/tree/#view=coupleRelationship&relationshipId={{cid}}):

        1. Review the record hints for [{{wifeName}}](https://familysearch.org/tree/#view=allMatchingRecords&person={{wid}}) and [{{husbandName}}](https://familysearch.org/tree/#view=allMatchingRecords&person={{hid}}) in FamilySearch.
        1. Do a broad searches on popular genealogy websites using the links below or the [RootsSearch](https://chrome.google.com/webstore/detail/rootssearch/aolcffalbhpnojekmimmelebjchjmmgn?hl=en) Chrome Extension.
        1. Use the record search feature of [Find-A-Record]({{farUrl}}).
        1. Ask for help at the [Genealogy and Family History](http://genealogy.stackexchange.com/) Stack Exchange website.
        1. Visit a local [Family History Center](https://familysearch.org/ask/help#localResource).
        1. Hire a researcher from the [genlighten](http://www.genlighten.com/) community.
      */}, {
      cid: marriage.id, 
      couple: wife.$getDisplayName() + ' and ' + husband.$getDisplayName(),
      wifeName: wife.$getDisplayName(),
      husbandName: husband.$getDisplayName(),
      wid: wife.id,
      hid: husband.id,
      farUrl: utils.farSearchUrl(findarecord)
    });

    var opportunity = {
      id: this.id + ':' + person.id,
      type: this.type,
      title: this.title,
      description: descr,
      person: person,
      findarecord: findarecord,
      gensearch: utils.gensearchPerson(person)
    };
    
    opportunity.gensearch.marriageDate = marriageYear+'';
    opportunity.gensearch.marriagePlace = marriagePlace;

    if(spouse !== undefined) {
      opportunity.gensearch.spouseGivenName = spouse.$getGivenName();
      opportunity.gensearch.spouseFamilyName = spouse.$getSurname();
    }

    return opportunity;

  }
};