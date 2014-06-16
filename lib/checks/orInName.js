/**
 * Returns an opportunity if:
 *  1. The person's preferred name has an "or" in it (Joe or Joey Adams)
 *  2. The person's preferred name doesn't have an or but an alternate name does
 */
var utils = require('../util.js'),
    regex = / or /;

// TODO: suggest what the new preferred name and alternate names should be
//       this can easily be done by examining the given name and surname separately
    
module.exports = {
  id: 'orInName',
  type: 'cleanup',
  title: 'Incorrect Alternate Name Format',
  signature: 'person',
  check: function(person) {

    var descr,
        name = person.$getPreferredName(),
        nameText = name && name.$getFullText() ? name.$getFullText() : '',
        nameMatches = nameText.match(regex);

    if(nameMatches) {

      descr = utils.markdown(function(){/*
        This person's name has an "or" in it which is incorrectly used to document alternate given names or alternate surnames.
        It is better to add the alternate form as a separate name altogether.
        In the [Family Tree](https://familysearch.org/tree/#view=ancestor&person={{pid}}), add the alternate form as an
        alternate name then remove it from the person's preferred name.
        
        ## Help
    
        * [Adding more information about a person who is already in Family Tree](https://familysearch.org/ask/productSupport#/Adding-More-Information-about-a-Person-Who-Is-Already-in-Family-Tree)
        * [Adding a custom event or fact to a person](https://familysearch.org/ask/productSupport#/Adding-a-Custom-Event-or-Fact-to-a-Person)
        * [Correcting information about a person](https://familysearch.org/ask/productSupport#/Correcting-Information-about-a-Person)      
      */}, { pid: person.id });
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

        if(fullText && fullText.match(regex) !== null){
          badNames.push(fullText);
        }
      }
      
      if(badNames.length > 0){
        descr = utils.markdown(function(){/*
          These alternate names have an "or" in it which is often incorrectly used to document alternate given names or alternate surnames.
          It is better to add the alternate form as a separate alternate name instead.
          In the [Family Tree](https://familysearch.org/tree/#view=ancestor&person={{pid}}), add the alternate form as
          another alternate name and remove it from the original alternate name.
          
          {{#badNames}}
          * {{.}}
          {{/badNames}}
          
          ## Help
      
          * [Adding more information about a person who is already in Family Tree](https://familysearch.org/ask/productSupport#/Adding-More-Information-about-a-Person-Who-Is-Already-in-Family-Tree)
          * [Adding a custom event or fact to a person](https://familysearch.org/ask/productSupport#/Adding-a-Custom-Event-or-Fact-to-a-Person)
          * [Correcting information about a person](https://familysearch.org/ask/productSupport#/Correcting-Information-about-a-Person)      
        */}, {
          badNames: badNames,
          pid: person.id
        });
      }
    }
    
    if(descr){
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