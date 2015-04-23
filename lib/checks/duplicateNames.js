/**
 * Returns an opportunity if:
 *  1. There are duplicates names (ignoring capitalization and punctuation)
 */
var utils = require('../util'),
    help = require('../help');

module.exports = {
  id: 'duplicateNames',
  type: 'cleanup',
  signature: 'person',
  help: help.links('addingAndCorrecting','customEvents'),
  check: function(person) {

    var names = person.$getNames(),
        simplified = {},
        duplicates = [];

    // Track which names are similar
    for(var i = 0; i < names.length; i++){
      var name = names[i],
          fullText = name.$getFullText();
      if(fullText){
        var simple = fullText.toLowerCase().replace(/[\W]/g, '');
        if(simplified[simple]){
          simplified[simple].push(fullText);
        } else {
          simplified[simple] = [fullText];
        }
      }
    }
    
    // Extract similar names
    for(var s in simplified){
      if(simplified[s].length > 1){
        duplicates.push(simplified[s]);
      }
    }
        
    if(duplicates.length > 0) {

      var template = {
        pid: person.id,
        name: person.$getDisplayName(),
        duplicates: duplicates
      };

      return utils.createOpportunity(this, person, template);

    }
  }
};