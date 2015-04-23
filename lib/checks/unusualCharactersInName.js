/**
 * Returns an opportunity if:
 *  1. There are unusual characters in the preferred name
 *  2. There are no unusual characters in the preferred name but there are unusual characters in an alternate name
 */
var utils = require('../util'),
    help = require('../help'),
    badChars = /[\{\}\[\]\(\)\<\>\!\@\#\$\%\^\&\*\+\=\/\|\\\?\_]/g;

// TODO: suggest what the new preferred name and alternate names should be
//       this can easily be done by examining the given name and surname separately
    
module.exports = {
  id: 'unusualCharactersInName',
  type: 'cleanup',
  signature: 'person',
  help: ['addingAndCorrecting','customEvents'],
  check: function(person) {

    var name = person.$getPreferredName(),
        nameText = name && name.$getFullText() ? name.$getFullText() : '',
        nameMatches = nameText.match(badChars),
        template;

    if(nameMatches) {
      template = {
        chars: '`' + nameMatches.join('`, `') + '`',
        pid: person.id,
        brackets: nameText.match(/(\([^\)]*\))|(\{[^\}]*\})|(\[[^\]]*\])|(\<[^\>]*\>)/) !== null,
        preferred: true
      };
    } 
    
    // If the preferred name doesn't have any unusual characters
    // then examine the alternate names
    else if(person.$getNames().length > 1){
      
      var names = person.$getNames(),
          badNames = [];
          
      for(var i = 0; i < names.length; i++){
        
        var name = names[i],
            fullText = name.$getFullText();
        
        // Skip the preferred name
        if(name.preferred) continue;

        if(fullText && fullText.match(badChars) !== null){
          badNames.push(fullText);
        }
      }
      
      if(badNames.length > 0){
        template = {
          badNames: badNames,
          pid: person.id,
          preferred: false
        };
      }
    }
    
    if(template){
      return utils.createOpportunity(this, person, template);
    }
  }
};