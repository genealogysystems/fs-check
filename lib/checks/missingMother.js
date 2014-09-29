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
        [{{fathername}}](https://familysearch.org/tree/#view=ancestor&person={{fid}}) is listed as a mother of [{{name}}](https://familysearch.org/tree/#view=ancestor&person={{pid}}) but there is no father. Try these steps to find the father:
        
        1. Review the [record hints](https://familysearch.org/tree/#view=allMatchingRecords&person={{pid}}) in FamilySearch.
        1. Do broad searches on popular genealogy websites using the links below or using the [RootsSearch](https://chrome.google.com/webstore/detail/rootssearch/aolcffalbhpnojekmimmelebjchjmmgn?hl=en) Chrome Extension.
        1. Ask for help at the [Genealogy and Family History](http://genealogy.stackexchange.com/) Stack Exchange website.
        1. Visit a local [Family History Center](https://familysearch.org/ask/help#localResource).
        1. Hire a researcher from the [Genlighten](http://www.genlighten.com/) community.
      */}, {
        fathername: father.$getDisplayName(),
        fid: father.id,
        name: child.$getDisplayName(),
        pid: child.id
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