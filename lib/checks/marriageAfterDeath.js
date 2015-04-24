/**
 * Returns an opportunity if a marriage date is after the person's death date
 */
var utils = require('../util.js'),
    GedcomXDate = require('gedcomx-date');

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
    
    var formalDeathGedx = new GedcomXDate(formalDeathDate);
    utils.ensureFullDate(formalDeathGedx, 12, 31);
    
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
        if(formalMarriageDate){
          var formalMarriageGedx = new GedcomXDate(formalMarriageDate);
          utils.ensureFullDate(formalMarriageGedx);
          if(utils.compareFormalDates(formalMarriageGedx, formalDeathGedx) === 1){
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
    }

    if(problemMarriages.length > 0) {
    
      var spouses = [];
      for(var i = 0; i < problemMarriages.length; i++){
        var spouseId = problemMarriages[i].spouseId;
        spouses.push({
          spouseName: people[spouseId].$getDisplayName(),
          coupleId: problemMarriages[i].coupleId
        });
      }
      
      var template = {
        pid: person.id,
        name: person.$getDisplayName(),
        spouses: spouses 
      };

      return utils.createOpportunity(this, person, template);

    }
  }
};