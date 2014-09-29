var utils = require('../util.js');

module.exports = {
  id: 'missingParents',
  type: 'family',
  title: 'Missing Parents',
  signature: 'parents',
  check: function(child, parents) {

    // Only generate an opportunity if there are no parents
    if(!parents || parents.length === 0) {
    
      var birth = child.$getBirth(),
          birthYear, birthPlace;
      if(birth) {
        birthYear = utils.getFactYear(birth);
        birthPlace = utils.getFactPlace(birth);
      }
      
      var descr = utils.markdown(function(){/*
        Try these steps to find the parents of [{{name}}](https://familysearch.org/tree/#view=ancestor&person={{pid}}):
        
        1. Review the [record hints](https://familysearch.org/tree/#view=allMatchingRecords&person={{pid}}) in FamilySearch.
        1. Do broad searches on popular genealogy websites using the links below or using the [RootsSearch](https://chrome.google.com/webstore/detail/rootssearch/aolcffalbhpnojekmimmelebjchjmmgn?hl=en) Chrome Extension.
        1. Ask for help at the [Genealogy and Family History](http://genealogy.stackexchange.com/) Stack Exchange website.
        1. Visit a local [Family History Center](https://familysearch.org/ask/help#localResource).
        1. Hire a researcher from the [Genlighten](http://www.genlighten.com/) community.
      */}, { 
        pid: child.id,
        name: child.$getDisplayName()
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
        gensearch: utils.gensearchPerson(child)
      };
    }
    
  }
};