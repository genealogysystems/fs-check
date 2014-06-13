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
        To find parents, start by searching collections containing birth records.
        If you haven't found a record in any of those collections, try expanding your search to some of the popular online repositories.
        If you still haven't found it, try using Find-A-Record to look for collections that are not available online (like microfilm).
        When you find the parents, add them to the tree in [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}).
        
        ## Help
        
        * [Add a New Person to the Family Tree](https://familysearch.org/ask/productSupport#/Adding-a-New-Person-to-Your-Existing-Tree)
        * [Updating Relationships Between Parents and Children](https://familysearch.org/ask/productSupport#/Adding-Changing-and-Deleting-Relationship-Types-between-Parents-and-Children)
      */}, { pid: child.id });

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