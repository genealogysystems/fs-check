var utils = require('../util.js');

module.exports = {
  id: 'missingMother',
  type: 'family',
  signature: 'child',
  help: [],
  check: function(child, mother, father, childRelationship) {

    // Only generate an opportunity if there is no mother
    if(!mother) {
    
      var birth = child.$getBirth(),
          birthYear, birthPlace;
      if(birth) {
        birthYear = utils.getFactYear(birth);
        birthPlace = utils.getFactPlace(birth);
      }
      
      var template = {
        fathername: father.$getDisplayName(),
        fid: father.id,
        name: child.$getDisplayName(),
        pid: child.id
      };
      
      var gensearch = {
        givenName: child.$getGivenName(),
        familyName: child.$getSurname(),
        birthPlace: birthPlace,
        birthDate: birthYear+'',
        fatherGivenName: father.$getGivenName(),
        fatherFamilyName: father.$getSurname()
      };
  
      return utils.createOpportunity(this, child, template, gensearch);
    }
    
  }
};