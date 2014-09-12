var utils = require('../util.js');

module.exports = {
  id: 'recordHints',
  type: 'source',
  title: 'Record Hints',
  signature: 'recordHints',
  check: function(person, matches) {

    // Short-circuit if there are no hints
    var count = matches.getResultsCount();
    if(count === 0){
      return;
    }
    
    var results = matches.getSearchResults(),
        titles = [];
    for(var i = 0; i < results.length; i++){
      titles.push(results[i].title);
    }

    var descr = utils.markdown(function(){/*
        FamilySearch has found matching records for {{name}} in the following collections:

        {{#titles}}
        * {{.}}
        {{/titles}}
        
        [Review these matches](https://familysearch.org/tree/#view=allMatchingRecords&person={{pid}}) and attach the sources to your tree.
        
        ## Help
    
        * [Record Hints](https://familysearch.org/ask/productSupport#/Record-Hints)
      */}, {
        titles: titles,
        name: person.$getDisplayName(),
        pid: person.id
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