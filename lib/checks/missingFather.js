var utils = require('../util.js');

module.exports = {
  id: 'missingFather',
  type: 'family',
  signature: 'child',
  help: [],
  check: function(child, mother, father, childRelationship) {

    // Only generate an opportunity if there is no father
    if(!father) {
    
      var birth = child.$getBirth(),
          birthYear, birthPlace;
      if(birth) {
        birthYear = utils.getFactYear(birth);
        birthPlace = utils.getFactPlace(birth);
      }
      
      var template = {
        mothername: mother.$getDisplayName(),
        mid: mother.id,
        name: child.$getDisplayName(),
        pid: child.id
      };
      
      var gensearch = {
        givenName: child.$getGivenName(),
        familyName: child.$getSurname(),
        birthPlace: birthPlace,
        birthDate: birthYear+'',
        motherGivenName: mother.$getGivenName(),
        motherFamilyName: mother.$getSurname()
      };
  
      return utils.createOpportunity(this, child, template, gensearch);

    }
    
  }
};