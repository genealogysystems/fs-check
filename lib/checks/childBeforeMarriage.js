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
        childrenBeforeMarriage = [];
    
    // Short-circuit if there are no marriages
    if(marriages.length === 0){
      return;
    }
    
    // For each marriage that has a marriage date,
    // look to see if the children were born before the marriage
    for(var i = 0; i < marriages.length; i++){
      
      var marriage = marriages[i],
          marriageFacts = marriage.$getFacts(),
          marriageDates = [];
      
      // Collect all available formal marriage dates
      for(var j = 0; j < marriageFacts.length; j++){
        var fact = marriageFacts[j];
        if(fact.type === 'http://gedcomx.org/Marriage'){
          var date = utils.getFormalDate(fact);
          if(date){
            marriageDates.push(date);
          }
        }
      }
      
      // Sort the marriage dates to find the earliest one
      marriageDates.sort(utils.compareFormalDates);
      
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
      for(var j = 0; j < children.length; j++){
      
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
        
        var birthDate = utils.getFormalDate(birth);
        
        // Short-circuit if the birth fact doesn't have a formal date
        if(!birthDate){
          continue;
        }
        
        if(utils.compareFormalDates(marriageDate, birthDate) === 1){
          childrenBeforeMarriage.push({
            marriage: marriage,
            child: child,
            birthDate: birthDate
          });
        }
      }
    }

    if(childrenBeforeMarriage.length > 0) {
    
      var children = [];
      for(var i = 0; i < childrenBeforeMarriage.length; i++){
        var data = childrenBeforeMarriage[i],
            spouseId = data.marriage.$getSpouseId(person.id),
            spouse = persons[spouseId],
            child = data.child,
            duration = utils.GedcomXDate.getDuration(new utils.GedcomXDate(data.birthDate), new utils.GedcomXDate(marriageDate)),
            durationString = utils.getSimpleDurationString(duration);
        children.push({
          spouseName: spouse.$getDisplayName(),
          spouseId: spouseId,
          childName: child.$getDisplayName(),
          childId: child.id,
          durationString: durationString
        });
      }

      var descr = utils.markdown(function(){/*
          It is abnormal for a child to be born before a couple is married. Check the marriages with the
          following people to verify that the marriage date and children's birth dates and fix any incorrect 
          information in the [Family Tree](https://familysearch.org/tree/#view=ancestor&person={{pid}}).
          
          {{#children}}
          * [{{childName}}](https://familysearch.org/tree/#view=ancestor&person={{childId}}) was born {{durationString}} before {{name}} married [{{spouseName}}](https://familysearch.org/tree/#view=ancestor&person={{spouseId}}).
          {{/children}}

          ## Help
      
          * [Correcting information in the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
        */}, {
          pid: person.id,
          name: person.$getDisplayName(),
          children: children
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