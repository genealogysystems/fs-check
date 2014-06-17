/**
 * Returns an opportunity if:
 *  1. Person has possible matches
 */
var utils = require('../util.js');

module.exports = {
  id: 'possibleDuplicates',
  type: 'cleanup',
  title: 'Possible Duplicate Persons',
  signature: 'duplicates',
  check: function(person, matches) {

    if(matches.getResultsCount() === 0) {
      return;
    }

    var descr = utils.markdown(function(){/*
        FamilySearch has identified {{count}} {{people}} as potential duplicates of {{person.display.name}}.
        Review the [list of duplicates](https://familysearch.org/tree/#view=possibleDuplicates&person={{person.id}}) in FamilySearch.
        Merge duplicate persons and mark incorrect matches as "Not a Match".

        ## Help
    
        * [Merging duplicate records in Family Tree](https://familysearch.org/ask/productSupport#/Merging-Duplicate-Records-in-Family-Tree-1381814853391)
      */}, {
        person: person,
        count: matches.getResultsCount(),
        people: matches.getResultsCount() === 1 ? 'person' : 'people'
      });

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
};