/**
 * Returns an opportunity if:
 *  1. There is a wife OR husband
 *  2. There is only 1 marriage fact
 *  3. There is an original date
 *  4. There is no formal date
 */
var utils = require('../util'),
    help = require('../help');

module.exports = {
  id: 'standardizeMarriageDate',
  type: 'cleanup',
  signature: 'marriage',
  help: help.links('standardizing'),
  check: function(wife, husband, marriage) {

    if(!wife || !husband){
      return;
    }

    var marriageFact = marriage.$getMarriageFact();

    // If we don't have exactly one marriage fact, don't run
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

    // If we have an original date without a formal date
    if(marriageFact.$getDate() !== undefined && marriageFact.$getNormalizedDate() === undefined) {

      var template = {
        crid: marriage.id, 
        wifeName: wife.$getDisplayName(),
        husbandName: husband.$getDisplayName(),
        date: facts[0].$getDate()
      };
  
      return utils.createOpportunity(this, wife, template);

    }
  }
};