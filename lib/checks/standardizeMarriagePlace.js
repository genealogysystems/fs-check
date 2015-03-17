/**
 * Returns an opportunity if:
 *  1. There is a wife OR husband
 *  2. There is only 1 marriage fact
 *  3. There is an original place
 *  4. There is no normalized place
 */
var utils = require('../util'),
    help = require('../help');

module.exports = {
  id: 'standardizeMarriagePlace',
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

    // If we have an original place without a normalized place
    if(marriageFact.$getPlace() !== undefined && marriageFact.$getNormalizedPlace() === undefined) {

      var template = {
        crid: marriage.id,
        wifeName: wife.$getDisplayName(),
        husbandName: husband.$getDisplayName(),
        place: marriageFact.$getPlace()
      };
  
      return utils.createOpportunity(this, wife, template);

    }
  }
};