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
  
    // Can't run if there is no death or no spouses
    if(!death || spouseIds.length == 0) {
      return;
    }
    
    var formalDeathDate = utils.getFormalDate(death, true);
    
    // Can't run if there is no date to work with
    if(!formalDeathDate){
      return;
    }
    
    // For each couple relationship, compare death date with all marriage events
    for(var i = 0; i < spouseIds.length; i++){
      var coupleRelationship = relationships.getSpouseRelationship(spouseIds[i]),
          coupleFacts = coupleRelationship.$getFacts(),
          problemMarriage = false;
      for(var j = 0; !problemMarriage && j < coupleFacts.length; j++){
        var fact = coupleFacts[j];
        if(!fact.date){
          continue;
        }
        var formalMarriageDate = utils.getFormalDate(fact);
        if(utils.compareFormalDates(formalMarriageDate, formalDeathDate) === 1){
          problemMarriage = true;
          problemMarriages.push({
            spouseId: spouseIds[i],
            coupleId: coupleRelationship.id,
            fact: fact,
            formalDate: formalMarriageDate
          });
        }
      }
    }

    if(problemMarriages.length > 0) {
    
      var spouses = [];
      for(var i = 0; i < problemMarriages.length; i++){
        var spouseId = problemMarriages[i].spouseId,
            duration = utils.GedcomXDate.getDuration(new utils.GedcomXDate(formalDeathDate), new utils.GedcomXDate(problemMarriages[i].formalDate));
        spouses.push({
          spouseName: relationships.getPerson(spouseId).$getDisplayName(),
          coupleId: problemMarriages[i].coupleId,
          durationString: utils.getSimpleDurationString(duration)
        });
      }
    
      var descr = utils.markdown(function(){/*
          {{name}} died {{deathDate}} but has marriage events which occurred after that date. This is impossible.
          Either the death date is wrong or the marriage dates are wrong. 
          View the couple relationships in FamilySearch to fix the problem.
          
          {{#spouses}}
          * [{{spouseName}}](https://familysearch.org/tree/#view=coupleRelationship&relationshipId={{coupleId}}) - A marriage event occured {{durationString}} after {{name}}'s death.
          {{/spouses}}

        */}, {
          pid: person.id,
          name: person.$getDisplayName(),
          deathDate: utils.getNormalizedDateString(formalDeathDate),
          spouses: spouses 
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