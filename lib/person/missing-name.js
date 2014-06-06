/**
 * Returns an opportunity if:
 *  1. There is no name
 */
var utils = require('../util.js');

module.exports = function(person) {

  if(!person.names || person.names.length === 0) {

    var descr = utils.markdown(function(){/*
      This person's name is not known. There are few reasons for a person to exist in the tree without a name.
      In fact, FamilySearch no longer allows people to be created without a name.
      If there is no information for this person other than the gender then you can safely delete the person.

      ## Help
  
      * [Deleting a person from Family Tree](https://familysearch.org/ask/productSupport#/Deleting-a-Person-from-the-System)
    */});

    return {
      type: 'person',
      title: 'Missing a Name',
      description: descr,
      person: person,
      findarecord: undefined,
      gensearch: utils.gensearchPerson(person)
    };
  }
}