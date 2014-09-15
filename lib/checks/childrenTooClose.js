/**
 * Returns an opportunity if two children are born less than 9 months apart
 */
var utils = require('../util.js');

module.exports = {
  id: 'childrenTooClose',
  type: 'problem',
  title: 'Children Too Close',
  signature: 'children',
  check: function(person, children) {

    // Only look at women
    if(person.gender.type !== 'http://gedcomx.org/Female'){
      return;
    }
    
    if(children.length === 0){
      return;
    }
    
    // Make sure all children with birth dates have
    // a formal date set
    var compareChildrenList = [];
    for(var i = 0; i < children.length; i++){
      var child = children[i],
          birth = child.$getBirth();
      if(!birth || !birth.date){
        continue;
      }
      var newFormalDate = utils.getFormalDate(birth);
      if(newFormalDate){
        birth.$setFormalDate(newFormalDate);
        compareChildrenList.push(child);
      }
    }

    // Sort children based on birth date
    compareChildrenList.sort(function(a, b){
      return utils.compareFormalDates(a.$getBirth().$getFormalDate(), b.$getBirth().$getFormalDate());
    });
    
    // Compare birth dates
    var problemPairs = [];
    for(var i = 1; i < compareChildrenList.length; i++){
      var previousChild = compareChildrenList[i-1],
          currentChild = compareChildrenList[i],
          previousChildBirthDate = previousChild.$getBirth().$getFormalDate(),
          currentChildBirthDate = currentChild.$getBirth().$getFormalDate(),
          birthDuration = utils.GedcomXDate.getDuration(new utils.GedcomXDate(previousChildBirthDate), new utils.GedcomXDate(currentChildBirthDate));
      if(!birthDuration.getYears() && birthDuration.getMonths() < 9){
        problemPairs.push({
          firstName: previousChild.$getDisplayName(),
          id1: previousChild.id,
          secondName: currentChild.$getDisplayName(),
          id2: currentChild.id,
          duration: utils.getSimpleDurationString(birthDuration)
        });
      }
    }
    
    if(problemPairs.length === 0){
      return;
    }

    var descr = utils.markdown(function(){/*
        [{{name}}](https://familysearch.org/tree/#view=ancestor&person={{pid}}) has children born less than 9 months apart. This can only happen with
        the birth of twins or a premature birth. Examine the birth dates of these children
        closely to veriy that they are correct. Find sources to support the birth dates if you can.
        
        {{#pairs}}
        * [{{secondName}}](https://familysearch.org/tree/#view=ancestor&person={{id2}}) was born {{duration}} after [{{firstName}}](https://familysearch.org/tree/#view=ancestor&person={{id1}})
        {{/pairs}}
      */}, {
        pid: person.id,
        name: person.$getDisplayName(),
        pairs: problemPairs
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