/**
 * Returns an opportunity if:
 *  1. There is no name
 */
var utils = require('../util.js');

module.exports = {
  id: 'missingName',
  type: 'person',
  title: 'Missing a Name',
  signature: 'person',
  check: function(person) {

    if(!person.names || person.names.length === 0) {

      var descr = utils.markdown(function(){/*
        This person's name is not known. There are few reasons for a person to exist in the tree without a name.
        In fact, FamilySearch no longer allows people to be created without a name.
        If there is no other information nor relationships for this person then you can safely delete the person.

        ## Help
    
        * [Adding more information about a person who is already in Family Tree](https://familysearch.org/ask/productSupport#/Adding-More-Information-about-a-Person-Who-Is-Already-in-Family-Tree)
        * [Adding a custom event or fact to a person](https://familysearch.org/ask/productSupport#/Adding-a-Custom-Event-or-Fact-to-a-Person)
        * [Correcting information about a person](https://familysearch.org/ask/productSupport#/Correcting-Information-about-a-Person)
        * [Deleting a person from Family Tree](https://familysearch.org/ask/productSupport#/Deleting-a-Person-from-the-System)
      */});

      return {
        id: this.id + ':' + person.id,
        type: this.type,
        title: this.title,
        description: descr,
        person: person,
        findarecord: undefined,
        gensearch: utils.gensearchPerson(person)
      };
    }
  }
};