/**
 * Returns an opportunity if:
 *  1. There is a wife OR husband
 *  2. There is only 1 marriage fact
 *  3. There is a place
 */
var utils = require('../util');

module.exports = {
  id: 'missingMarriageDate',
  type: 'family',
  signature: 'marriage',
  help: [],
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
    
    var template = {
      crid: marriage.id,
      wid: wife.id,
      hid: husband.id,
      wifeName: wife.$getDisplayName(),
      husbandName: husband.$getDisplayName()
    };
    
    var gensearch = utils.gensearchPerson(wife);
    
    gensearch.marriagePlace = place;
    gensearch.spouseGivenName = husband.$getGivenName();
    gensearch.spouseFamilyName = husband.$getSurname();

    return utils.createOpportunity(this, wife, template, gensearch);
  }
};