/**
 * Returns an opportunity if:
 *  1. There are unusual characters in the preferred name
 *  2. There are no unusual characters in the preferred name but there are unusual characters in an alternate name
 */
var utils = require('../util.js'),
    badChars = /[\{\}\[\]\(\)\<\>\!\@\#\$\%\^\&\*\+\=\/\|\\\?]/g;

// TODO: suggest what the new preferred name and alternate names should be
//       this can easily be done by examining the given name and surname separately
    
module.exports = function(person) {

  var name = person.$getPreferredName(),
      nameText = name && name.$getFullText() ? name.$getFullText() : '',
      nameMatches = nameText.match(badChars);

  if(nameMatches) {

    var descr = utils.markdown(function(){/*
      This person has the following unusual characters in their name: {{chars}}.
      {{#brackets}}
      These characters are often used to annotate an alternate given name or surname, but this is better done by adding an alternate name.
      Remove the alternate annotations from the preferred name and add them as alternate names.
      {{/brackets}}
      {{^brackets}}      
      These characters are not normally found in names. Update the person's name in the [Family Tree](https://familysearch.org/tree/#view=ancestor&person={{pid}}) to remove the unusual characters.
      {{/brackets}}      
      
      ## Help
  
      * [Adding more information about a person who is already in Family Tree](https://familysearch.org/ask/productSupport#/Adding-More-Information-about-a-Person-Who-Is-Already-in-Family-Tree)
      * [Adding a custom event or fact to a person](https://familysearch.org/ask/productSupport#/Adding-a-Custom-Event-or-Fact-to-a-Person)
      * [Correcting information about a person](https://familysearch.org/ask/productSupport#/Correcting-Information-about-a-Person)      
    */}, {
      chars: '`' + nameMatches.join('`, `') + '`',
      pid: person.id,
      brackets: nameText.match(/(\([^\)]*\))|(\{[^\}]*\})|(\[[^\]]*\])|(\<[^\>]*\>)/) !== null
    });

    return {
      type: 'cleanup',
      title: 'Unusual Characters in a Name',
      description: descr,
      person: person,
      findarecord: undefined,
      gensearch: undefined
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
      var descr = utils.markdown(function(){/*
        These alternate names have characters which normally do not appear in names:
        
        {{#badNames}}
        * {{.}}
        {{/badNames}}
        
        Update these names in the [Family Tree](https://familysearch.org/tree/#view=ancestor&person={{pid}}) to remove the unusual characters.   
        
        ## Help
    
        * [Adding more information about a person who is already in Family Tree](https://familysearch.org/ask/productSupport#/Adding-More-Information-about-a-Person-Who-Is-Already-in-Family-Tree)
        * [Adding a custom event or fact to a person](https://familysearch.org/ask/productSupport#/Adding-a-Custom-Event-or-Fact-to-a-Person)
        * [Correcting information about a person](https://familysearch.org/ask/productSupport#/Correcting-Information-about-a-Person)      
      */}, {
        badNames: badNames,
        pid: person.id
      });

      return {
        type: 'cleanup',
        title: 'Unusual Characters in a Name',
        description: descr,
        person: person,
        findarecord: undefined,
        gensearch: undefined
      };
    }
  }
}