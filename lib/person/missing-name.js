/**
 * Returns an opportunity if:
 *  1. There is no name
 */
var utils = require('../util.js');

module.exports = function(person) {

  if(person.names && person.names.length === 0) {

    var descr = utils.markdown(function(){/*
        Start with a general search in some of the popular online repositories.
        If they lived in the United States within the last 100 years, the SociaL Security Death Index is a good place to start.
        Once you have found a record of the death, go to [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}) and enter it.

        ## Help
    
        * [Adding a death to the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
        * [Explaining approximate death dates](https://familysearch.org/ask/productSupport#/Do-not-know-exact-birth-date-or-death-date)
      */}, {pid:  person.id});


    var opportunity = {
      type: 'problem',
      title: 'Missing a Name',
      description: descr,
      person: person,
      findarecord: undefined,
      gensearch: utils.getsearchPerson(person)
    };

    return opportunity;
  
  }

}