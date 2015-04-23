/**
 * Returns an opportunity if:
 *  1. There is more than one marriage fact
 */
var utils = require('../util'),
    help = require('../help');

module.exports = {
  id: 'multipleMarriageFacts',
  type: 'cleanup',
  signature: 'marriage',
  help: ['addingAndCorrecting'],
  check: function(wife, husband, marriage) {

    if(!wife || !husband){
      return;
    }

    // If we have more than one marriage fact, don't run
    var facts = marriage.$getFacts(),
        count = 0;
    for(var x in facts) {
      if(facts[x].type === 'http://gedcomx.org/Marriage') {
        count++;
      }
    }

    if(count < 2) {
      return;
    }

    var template = {
      crid:  marriage.id,
      wifeName: wife.$getDisplayName(),
      husbandName: husband.$getDisplayName()
    };

    return utils.createOpportunity(this, wife, template, utils.gensearchPerson(wife));

  }
};