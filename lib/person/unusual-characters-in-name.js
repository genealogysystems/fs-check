/**
 * Returns an opportunity if:
 *  1. There are unusual characters in the preferred name
 *  2. There are no unusual characters in the preferred name but there are unusual characters in an alternate name
 */
var utils = require('../util.js'),
    badChars = /[\{\}\[\]\(\)\<\>\!\@\#\$\%\^\&\*\+\=\/\|\\\?]/g;

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
      These characters are not normally found in names. You should probably update the person's name to remove them.
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
}