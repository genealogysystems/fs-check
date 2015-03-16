/**
 * Returns an opportunity if a marriage date is after the person's death date
 */
var utils = require('../util.js');

module.exports = {
  id: 'marriageAfterDeath',
  type: 'problem',
  signature: 'relationships',
  help: [],
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
        if(formalMarriageDate && utils.compareFormalDates(formalMarriageDate, formalDeathDate) === 1){
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
          spouseName: people[spouseId].$getDisplayName(),
          coupleId: problemMarriages[i].coupleId,
          durationString: utils.getSimpleDurationString(duration)
        });
      }
      
      var template = {
        pid: person.id,
        name: person.$getDisplayName(),
        deathDate: utils.getNormalizedDateString(formalDeathDate),
        spouses: spouses 
      };

      return utils.createOpportunity(this, person, template);

    }
  }
};