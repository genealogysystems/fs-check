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
  
    // Short-circuit if there are no matches
    var count = matches.getResultsCount();
    if(count === 0){
      return;
    }
  
    // Ignore results of low confidence like the web client does
    var goodMatches = 0,
        results = matches.getSearchResults();
    for(var i = 0; i < results.length; i++){
      if(results[i].confidence >= 3){
        goodMatches++;
      }
    }
    
    // Short-circuit if we have no good matches
    if(goodMatches === 0){
      return;
    }
  
    var descr = utils.markdown(function(){/*
        FamilySearch has identified {{count}} {{people}} {{name}}.
        Review the [list of duplicates](https://familysearch.org/tree/#view=possibleDuplicates&person={{pid}}) in FamilySearch.
        Merge duplicate persons and mark incorrect matches as "Not a Match".

        ## Help
    
        * [Merging duplicate records in Family Tree](https://familysearch.org/ask/productSupport#/Merging-Duplicate-Records-in-Family-Tree-1381814853391)
      */}, {
        pid: person.id,
        name: person.$getDisplayName(),
        count: goodMatches,
        people: goodMatches === 1 ? 'person as a potential duplicate' : 'people as potential duplicates'
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