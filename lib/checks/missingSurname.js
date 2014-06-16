/**
 * Returns an opportunity if:
 *  1. The preferred name does not have a surname but does have a given name
 */
var utils = require('../util.js');

module.exports = {
  id: 'missingSurname',
  type: 'person',
  title: 'Missing a Surname',
  signature: 'person',
  check: function(person) {

    var givenName = person.$getGivenName(),
        surname = person.$getSurname();

    if(givenName && (surname === undefined || surname === '')) {

      var descr = utils.markdown(function(){/*
        This person is missing a surname. It's possible that the surname is known but not filled in.
        Check to see if the surname appears in the list of alternate names or in any of the attached records.
        In most areas of the world, the surname can be inferred if the names of the parents are known.
        
        ## Help
    
        * [Adding more information about a person who is already in Family Tree](https://familysearch.org/ask/productSupport#/Adding-More-Information-about-a-Person-Who-Is-Already-in-Family-Tree)
        * [Adding a custom event or fact to a person](https://familysearch.org/ask/productSupport#/Adding-a-Custom-Event-or-Fact-to-a-Person)
        * [Correcting information about a person](https://familysearch.org/ask/productSupport#/Correcting-Information-about-a-Person)  
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