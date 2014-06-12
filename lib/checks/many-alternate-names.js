/**
 * Returns an opportunity if:
 *  1. There are 5 or more alternate names
 */
var utils = require('../util.js');

module.exports = function(person) {

  var names = person.$getNames();

  // Compare to 6 instead of 5 to allow for the preferred name
  if(names && names.length >= 6) {

    var alternates = [];
    for(var i = 0; i < names.length; i++){
      if(!names[i].preferred){
        alternates.push(names[i].$getFullText());
      }
    }
  
    var descr = utils.markdown(function(){/*
      When a person has many alternate names they are often duplicates, slight misspellings, or differ only in punctuation.
      Consider deleting some of the alternate names that aren't necessary in the [Family Tree](https://familysearch.org/tree/#view=ancestor&person={{pid}}).

      {{#names}}
      * {{.}}
      {{/names}}
      
      ## Help
  
      * [Adding more information about a person who is already in Family Tree](https://familysearch.org/ask/productSupport#/Adding-More-Information-about-a-Person-Who-Is-Already-in-Family-Tree)
      * [Adding a custom event or fact to a person](https://familysearch.org/ask/productSupport#/Adding-a-Custom-Event-or-Fact-to-a-Person)
      * [Correcting information about a person](https://familysearch.org/ask/productSupport#/Correcting-Information-about-a-Person)
    */}, {pid: person.id, names: alternates});

    return {
      type: 'cleanup',
      title: 'Many Alternate Names',
      description: descr,
      person: person,
      findarecord: undefined,
      gensearch: undefined
    };
  }
}