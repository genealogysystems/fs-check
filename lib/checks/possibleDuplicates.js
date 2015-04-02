/**
 * Returns an opportunity if:
 *  1. Person has possible matches
 */
var utils = require('../util'),
    help = require('../help');

module.exports = {
  id: 'possibleDuplicates',
  type: 'problem',
  signature: 'duplicates',
  help: help.links('mergingDuplicates'),
  check: function(person, matches) {
  
    // Short-circuit if there are no matches
    var count = matches.getResultsCount();
    if(count === 0){
      return;
    }
  
    // Ignore results of low confidence like the web client does
    var goodMatches = 0,
        results = matches.getSearchResults();
    for(var i = 0; i < results.length; i++){
      if(results[i].confidence >= 3){
        goodMatches++;
      }
    }
    
    // Short-circuit if we have no good matches
    if(goodMatches === 0){
      return;
    }
    
    var template = {
      pid: person.id,
      name: person.$getDisplayName(),
      count: goodMatches,
      singular: goodMatches === 1
    };

    return utils.createOpportunity(this, person, template);

  }
};