var utils = require('../util.js');

module.exports = {
  id: 'missingParents',
  type: 'family',
  signature: 'parents',
  help: [],
  check: function(child, parents) {

    // Only generate an opportunity if there are no parents
    if(!parents || parents.length === 0) {
    
      var birth = child.$getBirth(),
          birthYear, birthPlace;
      if(birth) {
        birthYear = utils.getFactYear(birth);
        birthPlace = utils.getFactPlace(birth);
      }
      
      var template = {
        name: child.$getDisplayName(),
        pid:  child.id
      };
  
      return utils.createOpportunity(this, child, template, utils.gensearchPerson(child));
    }
    
  }
};