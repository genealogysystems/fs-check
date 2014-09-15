/**
 * Returns an opportunity if a marriage date is after the person's death date
 */
var utils = require('../util.js');

module.exports = {
  id: 'marriageAfterDeath',
  type: 'problem',
  title: 'Marriage After Death',
  signature: 'relationships',
  check: function(person, relationships, people) {

    var death = person.$getDeath(),
        spouseIds = relationships.getSpouseIds(),
        problemMarriages = [];
  
    // Can't run if there is no death date or no spouses
    if(!death || !death.date || spouseIds.length == 0) {
      return;
    }
    
    var formalDeathDate = death.$getFormalDate(),
        deathYear = utils.getFactYear(death);
        
    if(!deathYear){
      return;
    }
    
    // For each couple relationship, compare death date with all marriage events
    for(var i = 0; i < spouseIds.length; i++){
      var coupleRelationship = relationships.getSpouseRelationship(spouseIds[i]),
          coupleFacts = coupleRelationship.$getFacts(),
          problemMarriage = false;
      for(var j = 0; !problemMarriage && j < coupleFacts.length; j++){
        var fact = coupleFacts[i];
        if(!fact.date){
          continue;
        }
        var formalDate = fact.$getFormalDate(),
            year = utils.getFactYear(deathYear);
        if(formalDeathDate && formalDate){
          if(utils.compareFormalDates(formalDate, formalDeathDate) === 1){
            problemMarriage = true;
          }
        } else if(deathYear < year) {
          problemMarriage = true;
        }
      }
      if(problemMarriage){
        problemMarriages.push(spouseIds[i]);
      }
    }

    if(problemMarriages.length > 0) {
    
      var spouses = [];
      for(var i = 0; i < problemMarriages.length; i++){
        var spouseId = problemMarriages[i];
        spouses.push({
          name: relationships.getPerson(spouseId).$getDisplayName(),
          cid: relationships.getSpouseRelationship(spouseId).id
        });
      }
    
      var descr = utils.markdown(function(){/*
          {{name}} died {{deathDate}} but has marriage events which occurred {{durationString}} after that date. This is impossible.
          Either the death date is wrong or the marriage dates are wrong. 
          View the couple relationships in FamilySearch to fix the problem.
          
          {{#spouses}}
          * __[{{name}}](https://familysearch.org/tree/#view=coupleRelationship&relationshipId={{cid}})__ 
          {{/spouses}}

        */}, {
          pid: person.id,
          name: person.$getDisplayName(),
          deathDate: death.$getDate(),
          spouses: spouses,
          durationString: 
        });

      var opportunity = {
        id: this.id + ':' + person.id,
        type: this.type,
        title: this.title,
        description: descr,
        person: person,
        findarecord: undefined,
        gensearch: undefined
      };

      return opportunity;

    }
  }
};