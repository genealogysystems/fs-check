/**
 * Returns an opportunity if:
 *  1. Marriage fact exists
 *  2. There is a husband or a wife
 *  2. There is only one marriage fact
 *  3. Marriage has a place
 *  4. Marriage has a date
 *  5. SourceRefs is empty
 */
var utils = require('../util');

module.exports = {
  id: 'missingMarriageSource',
  type: 'source',
  signature: 'marriageSource',
  help: [],
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
    
    var template ={
      cid: marriage.id, 
      couple: wife.$getDisplayName() + ' and ' + husband.$getDisplayName(),
      wifeName: wife.$getDisplayName(),
      husbandName: husband.$getDisplayName(),
      wid: wife.id,
      hid: husband.id
    };
    
    var gensearch = utils.gensearchPerson(person);
    gensearch.marriageDate = marriageYear+'';
    gensearch.marriagePlace = marriagePlace;
    if(spouse !== undefined) {
      gensearch.spouseGivenName = spouse.$getGivenName();
      gensearch.spouseFamilyName = spouse.$getSurname();
    }

    return utils.createOpportunity(this, person, template, gensearch);

  }
};