var utils = require('../util.js');

module.exports = function(child, mother, father, childRelationship) {

  // Only generate an opportunity if there is no father
  if(!father) {
  
    var birth = child.$getBirth(),
        birthYear, birthPlace;
    if(birth) {
      birthYear = utils.getFactYear(birth);
      birthPlace = utils.getFactPlace(birth);
    }
    
    var descr = utils.markdown(function(){/*
      {{mothername}} is listed as a mother but there is no father.
      To find the father, start by searching collections containing birth records.
      If you haven't found a record in any of those collections, try expanding your search to some of the popular online repositories.
      If you still haven't found it, try using Find-A-Record to look for collections that are not available online (like microfilm).
      When you find the father, add him to the tree and then add him as the father in [the child and parents relationship](https://familysearch.org/tree/#view=parentChildRelationship&relationshipId={{crid}}).
      
      ## Help
      
      * [Add a New Person to the Family Tree](https://familysearch.org/ask/productSupport#/Adding-a-New-Person-to-Your-Existing-Tree)
      * [Updating Relationships Between Parents and Children](https://familysearch.org/ask/productSupport#/Adding-Changing-and-Deleting-Relationship-Types-between-Parents-and-Children)
    */}, {
      mothername: mother.$getGivenName() + mother.$getSurname(),
      crid: childRelationship.id
    });

    return {
      type: 'family',
      title: 'Missing a Father',
      description: descr,
      person: child,
      findarecord: {
        tags: ['birth'],
        from: (birthYear)? birthYear-10:undefined,
        to: (birthYear)? birthYear+10:undefined,
        place: birthPlace
      },
      gensearch: {
        givenName: child.$getGivenName(),
        familyName: child.$getSurname(),
        birthPlace: birthPlace,
        birthDate: birthYear+'',
        motherGivenName: mother.$getGivenName(),
        motherFamilyName: mother.$getSurname()
      }
    };
  }
  
}