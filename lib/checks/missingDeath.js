/**
 * Returns an opportunity if:
 *  1. There is no death fact OR place and date are both undefined
 */
var utils = require('../util.js');

module.exports = {
  id: 'missingDeath',
  type: 'person',
  title: 'Find a Death',
  signature: 'person',
  check: function(person) {

    var death = person.$getDeath();

    if(death) {
      if(utils.getFactPlace(death) !== undefined || utils.getFactYear(death) !== undefined) {
        return;
      }
    }

    // TODO if they have a christening record, change the description

    var descr = utils.markdown(function(){/*
        Start with a general search in some of the popular online repositories.
        If they lived in the United States within the last 100 years, the SociaL Security Death Index is a good place to start.
        Once you have found a record of the death, go to [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}) and enter it.

        ## Help
    
        * [Adding a death to the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
        * [Explaining approximate death dates](https://familysearch.org/ask/productSupport#/Do-not-know-exact-birth-date-or-death-date)
      */}, {pid:  person.id});


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
};