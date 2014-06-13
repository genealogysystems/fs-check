var utils = require('../util.js');

module.exports = {
  id: 'missingMother',
  type: 'family',
  title: 'Missing a Mother',
  signature: 'child',
  check: function(child, mother, father, childRelationship) {

    // Only generate an opportunity if there is no mother
    if(!mother) {
    
      var birth = child.$getBirth(),
          birthYear, birthPlace;
      if(birth) {
        birthYear = utils.getFactYear(birth);
        birthPlace = utils.getFactPlace(birth);
      }
      
      var descr = utils.markdown(function(){/*
        {{fathername}} is listed as a father but there is no mother.
        To find the mother, start by searching collections containing birth records.
        If you haven't found a record in any of those collections, try expanding your search to some of the popular online repositories.
        If you still haven't found it, try using Find-A-Record to look for collections that are not available online (like microfilm).
        When you find the mother, add her to the tree and then add her as the mother in [the child and parents relationship](https://familysearch.org/tree/#view=parentChildRelationship&relationshipId={{crid}}).
        
        ## Help
        
        * [Add a New Person to the Family Tree](https://familysearch.org/ask/productSupport#/Adding-a-New-Person-to-Your-Existing-Tree)
        * [Updating Relationships Between Parents and Children](https://familysearch.org/ask/productSupport#/Adding-Changing-and-Deleting-Relationship-Types-between-Parents-and-Children)
      */}, {
        fathername: father.$getDisplayName(),
        crid: childRelationship.id
      });

      return {
        id: this.id + ':' + child.id,
        type: this.type,
        title: this.title,
        description: descr,
        person: child,
        findarecord: {
          tags: ['birth'],
          from: (birthYear)? birthYear-3:undefined,
          to: (birthYear)? birthYear+3:undefined,
          place: birthPlace
        },
        gensearch: {
          givenName: child.$getGivenName(),
          familyName: child.$getSurname(),
          birthPlace: birthPlace,
          birthDate: birthYear+'',
          fatherGivenName: father.$getGivenName(),
          fatherFamilyName: father.$getSurname()
        }
      };
    }
    
  }
};