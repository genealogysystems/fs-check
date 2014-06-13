/**
 * Returns an opportunity if:
 *  1. The preferred name does not have a given name but has a surname
 */
var utils = require('../util.js');

module.exports = {
  id: 'missingGivenName',
  type: 'person',
  title: 'Missing a Given Name',
  signature: 'person',
  check: function(person) {

    var givenName = person.$getGivenName(),
        surname = person.$getSurname();

    if(surname && (givenName === undefined || givenName === '')) {

      var descr = utils.markdown(function(){/*
        This person is missing a given name. It's possible that the name is known but not filled in.
        Check to see if the given name appears in the list of alternate names or in any of the attached records.
        It is possible that the person never had a given name, such as a child that died at birth.
        
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