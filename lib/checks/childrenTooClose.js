/**
 * Returns an opportunity if two children are born less than 9 months apart
 */
var utils = require('../util.js');

module.exports = {
  id: 'childrenTooClose',
  type: 'problem',
  signature: 'children',
  help: [],
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
          previousGedcomXDate = new utils.GedcomXDate(previousChildBirthDate),
          currentGedcomXDate = new utils.GedcomXDate(currentChildBirthDate);
      if(previousChildBirthDate && currentChildBirthDate && utils.compareFormalDates(previousGedcomXDate, currentGedcomXDate) !== 0){
        var birthDuration = utils.GedcomXDate.getDuration(previousGedcomXDate, currentGedcomXDate);
        if(!birthDuration.getYears() && birthDuration.getMonths() < 9){
          problemPairs.push({
            firstName: previousChild.$getDisplayName(),
            id1: previousChild.id,
            secondName: currentChild.$getDisplayName(),
            id2: currentChild.id
          });
        }
      }
    }
    
    if(problemPairs.length === 0){
      return;
    }
    
    var template = {
      pid: person.id,
      name: person.$getDisplayName(),
      pairs: problemPairs
    };

    return utils.createOpportunity(this, person, template);

  }
};

/**
 * Returns true of the formal dates are exactly equal.
 * If one of the dates is a partial date, such as +1904,
 * then compare the dates using all dates parts that
 * both dates have specified. In other words, consider
 * +1904 to equal any formal date in 1904 and consider
 * +1904-02 to equal any formal date in Feb 1904.
 */
function formalDatesEqual(date1, date2){
  if(date1 === date2){
    
  }
};