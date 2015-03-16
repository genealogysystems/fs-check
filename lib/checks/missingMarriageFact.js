/**
 * Returns an opportunity if there is a marriage but no marriage fact,
 * or there is 1 marriage fact with no date and place
 */
var utils = require('../util');

module.exports = {
  id: 'missingMarriageFact',
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

    if(count > 1) {
      return;
    }

    // End if we have a marriage date or place
    var marriageFact = marriage.$getMarriageFact();
    if(marriageFact && (utils.getFactYear(marriageFact) !== undefined || utils.getFactPlace(marriageFact) !== undefined)){
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
    gensearch.spouseGivenName = husband.$getGivenName();
    gensearch.spouseFamilyName = husband.$getSurname();

    return utils.createOpportunity(this, wife, template, gensearch);
  }
};