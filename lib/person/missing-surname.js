/**
 * Returns an opportunity if:
 *  1. The preferred name does not have a surname but does have a given name
 */
var utils = require('../util.js');

module.exports = function(person) {

  var givenName = person.$getGivenName(),
      surname = person.$getSurname();

  if(givenName && (surname === undefined || surname === '')) {

    var descr = utils.markdown(function(){/*
      This person is missing a surname. It's possible that the surname is known but not filled in.
      Check to see if the surname appears in the list of alternate names or in any of the attached records.
      In most areas of the world, the surname can be inferred if the names of the parents are known.
    */});

    return {
      type: 'person',
      title: 'Missing a Surname',
      description: descr,
      person: person,
      findarecord: undefined,
      gensearch: utils.gensearchPerson(person)
    };
  }
}