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
    
    // Gather a list of all children with a birth date.
    // If a formal date is not set, do our best to create one.
    var compareList = [];
    for(var i = 0; i < children.length; i++){
      var child = children[i],
          birth = child.$getBirth();
      if(!birth || !birth.date){
        continue;
      }
      var newFormalDate = utils.getFormalDate(birth);
      
      // Make sure we have a full (not partial) formal date 
      if(newFormalDate && utils.isFullDate(newFormalDate)){
        compareList.push({
          id: child.id,
          date: newFormalDate,
          name: child.$getDisplayName()
        });
      }
    }

    // Sort children based on birth date
    compareList.sort(function(a, b){
      return utils.compareFormalDates(a.date, b.date);
    });
    
    // Gather list of children born less than 9 months apart
    var problemPairs = [];
    for(var i = 1; i < compareList.length; i++){
      var previous = compareList[i-1],
          current = compareList[i],
          previousGedcomXDate = new utils.GedcomXDate(previous.date),
          currentGedcomXDate = new utils.GedcomXDate(current.date);
      
      // If the dates are not equal (ignore twins) then calculate time between dates
      if(utils.compareFormalDates(previousGedcomXDate, currentGedcomXDate) !== 0){
        var birthDuration = utils.GedcomXDate.getDuration(previousGedcomXDate, currentGedcomXDate);
        if(!birthDuration.getYears() && birthDuration.getMonths() < 9){
          problemPairs.push({
            firstName: previous.name,
            id1: previous.id,
            secondName: current.name,
            id2: current.id
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