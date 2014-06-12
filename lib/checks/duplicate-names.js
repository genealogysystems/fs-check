/**
 * Returns an opportunity if:
 *  1. There are duplicates names (ignoring capitalization and punctuation)
 */
var utils = require('../util.js');

module.exports = function(person) {

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
  
    var descr = utils.markdown(function(){/*
      This person has names which differ only by capitalization or punctuation.
      It is not necessary to document all of the different ways a name could be capitalized or punctuated.
      Consider deleting some of the alternate names that aren't necessary in the [Family Tree](https://familysearch.org/tree/#view=ancestor&person={{pid}}).

      {{#duplicates}}
      
      {{#.}}
      * {{.}}
      {{/.}}
      
      {{/duplicates}}
      
      ## Help
  
      * [Adding more information about a person who is already in Family Tree](https://familysearch.org/ask/productSupport#/Adding-More-Information-about-a-Person-Who-Is-Already-in-Family-Tree)
      * [Adding a custom event or fact to a person](https://familysearch.org/ask/productSupport#/Adding-a-Custom-Event-or-Fact-to-a-Person)
      * [Correcting information about a person](https://familysearch.org/ask/productSupport#/Correcting-Information-about-a-Person)
    */}, {pid: person.id, duplicates: duplicates});

    return {
      type: 'cleanup',
      title: 'Duplicate Names',
      description: descr,
      person: person,
      findarecord: undefined,
      gensearch: undefined
    };
  }
}