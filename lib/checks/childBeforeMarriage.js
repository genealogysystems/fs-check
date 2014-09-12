/**
 * Returns an opportunity if:
 *  - The person has a marriage with children where at least one of the children
 *    was born before the marriage.
 */
var utils = require('../util.js'),
    GedcomXDate = require('gedcomx-date');

module.exports = {
  id: 'childBeforeMarriage',
  type: 'problem',
  title: 'Child Born Before Marriage',
  signature: 'relationships',
  check: function(person, relationships, persons) {

    var marriages = relationships.getSpouseRelationships(),
        badMarriages = [];
    
    // Short-circuit if there are no marriages
    if(marriages.length === 0){
      return;
    }
    
    // For each marriage that has a marriage date,
    // look to see if the children were born before the marriage
    for(var i = 0; i < marriages.length; i++){
      
      var marriage = marriages[i],
          marriageFacts = marriage.$getFacts(),
          marriageDates = [],
          badMarriage = false;
      
      // Collect all available formal marriage dates
      for(var j = 0; j < marriageFacts.length; j++){
        var fact = marriageFacts[j];
        if(fact.type === 'http://gedcomx.org/Marriage'){
          var date = fact.$getFormalDate();
          if(date){
            marriageDates.push(date);
          }
        }
      }
      
      // Sort the marriage dates to find the earliest one
      marriageDates.sort(compareDates);
      
      if(marriageDates.length === 0){
        continue;
      }
      
      var marriageDate = marriageDates[0];
      
      // Get a list of children in this marriage
      var children = relationships.getChildRelationshipsOf(marriage.$getSpouseId(person.id));
      
      // Short circuit if there are no children in this marriage
      if(children.length === 0){
        continue;
      }
      
      // For each child in this marriage, check to see if they
      // have a birth date and if it's before the marriage date
      for(var j = 0; j < children.length && !badMarriage; j++){
      
        var rel = children[j],
            childId = rel.$getChildId(),
            child = persons[childId];
        
        // Short-circuit if we can't find the child. This should never happen.
        if(!child){
          continue;
        }
        
        var birth = child.$getBirth();
        
        // Short-circuit if the child has no birth fact
        if(!birth){
          continue;
        }
        
        var birthDate = birth.$getFormalDate();
        
        // Short-circuit if the birth fact doesn't have a formal date
        if(!birthDate){
          continue;
        }
        
        if(compareDates(marriageDate, birthDate) === 1){
          badMarriage = true;
          badMarriages.push(marriage);
        }
      }
    }

    if(badMarriages.length > 0) {
    
      var spouses = [];
      for(var i = 0; i < badMarriages.length; i++){
        var spouseId = badMarriages[i].$getSpouseId(person.id),
            spouse = persons[spouseId];
        if(spouse){
          spouses.push(spouse.display.name);
        }
      }

      var descr = utils.markdown(function(){/*
          It is abnormal for a child to be born before a couple is married. Check the marriages with the
          following people to verify that the marriage date and children's birth dates and fix any incorrect 
          information in the [Family Tree](https://familysearch.org/tree/#view=ancestor&person={{pid}}).
          
          {{#spouses}}
          * {{.}}
          {{/spouses}}

          ## Help
      
          * [Correcting information in the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
        */}, {
          pid:  person.id,
          spouses: spouses
        });

      return opportunity = {
        id: this.id + ':' + person.id,
        type: this.type,
        title: this.title,
        description: descr,
        person: person,
        findarecord: undefined,
        gensearch: undefined
      };
    }
  }
};

function compareDates(date1, date2){
  try {
    GedcomXDate.getDuration(new GedcomXDate(date1), new GedcomXDate(date2));
    return -1;
  } catch(e) {
    return 1;
  }
};