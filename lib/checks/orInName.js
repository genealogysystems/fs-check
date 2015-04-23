/**
 * Returns an opportunity if:
 *  1. The person's preferred name has an "or" in it (Joe or Joey Adams)
 *  2. The person's preferred name doesn't have an or but an alternate name does
 */
var utils = require('../util'),
    help = require('../help'),
    regex = / or /;

// TODO: suggest what the new preferred name and alternate names should be
//       this can easily be done by examining the given name and surname separately
    
module.exports = {
  id: 'orInName',
  type: 'cleanup',
  signature: 'person',
  help: ['addingAndCorrecting','customEvents'],
  check: function(person) {

    var name = person.$getPreferredName(),
        nameText = name && name.$getFullText() ? name.$getFullText() : '',
        nameMatches = nameText.match(regex),
        template = {
          pid: person.id
        };

    // Have an "or" in the preferred name
    if(nameMatches) {
      template.preferred = true;
      return utils.createOpportunity(this, person, template);
    } 
    
    // If the preferred name doesn't have a problem
    // then examine the alternate names
    else if(person.$getNames().length > 1){
      
      var names = person.$getNames(),
          badNames = [];
          
      for(var i = 0; i < names.length; i++){
        
        var name = names[i],
            fullText = name.$getFullText();
        
        // Skip the preferred name
        if(name.preferred) continue;

        if(fullText && fullText.match(regex) !== null){
          badNames.push(fullText);
        }
      }
      
      if(badNames.length > 0){
        
        template.badNames = badNames;
        template.preferred = false;
        
        return utils.createOpportunity(this, person, template);
      }
    }
    
  }
};