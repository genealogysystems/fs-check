var utils = require('../util'),
    help = require('../help');

module.exports = {
  id: 'recordHints',
  type: 'source',
  signature: 'recordHints',
  help: ['recordHints'],
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

    var template = {
      titles: titles,
      name: person.$getDisplayName(),
      pid: person.id
    };

    return utils.createOpportunity(this, person, template);

  }
};