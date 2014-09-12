/**
 * Returns an opportunity if:
 *  1. There are duplicates names (ignoring capitalization and punctuation)
 */
var utils = require('../util.js');

module.exports = {
  id: 'duplicateNames',
  type: 'cleanup',
  title: 'Identical Names',
  signature: 'person',
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
    
      var descr = utils.markdown(function(){/*
        This person has names which differ only by capitalization or punctuation.
        It is not necessary to document all of the different ways a name could be capitalized or punctuated.
        View [{{name}}](https://familysearch.org/tree/#view=ancestor&person={{pid}}) in the Family Tree and delete
        some of the unnecessary names.

        {{#duplicates}} 
        
        {{#.}}
        * {{.}}
        {{/.}} 
        
        {{/duplicates}}
        
        ## Help
    
        * [Adding more information about a person who is already in Family Tree](https://familysearch.org/ask/productSupport#/Adding-More-Information-about-a-Person-Who-Is-Already-in-Family-Tree)
        * [Adding a custom event or fact to a person](https://familysearch.org/ask/productSupport#/Adding-a-Custom-Event-or-Fact-to-a-Person)
        * [Correcting information about a person](https://familysearch.org/ask/productSupport#/Correcting-Information-about-a-Person)
      */}, {
        pid: person.id,
        name: person.display.name,
        duplicates: duplicates
      });

      return {
        id: this.id + ':' + person.id,
        type: this.type,
        title: this.title,
        description: descr,
        person: person,
        findarecord: undefined,
        gensearch: undefined
      };
    }
  }
};