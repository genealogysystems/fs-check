var utils = require('../util.js');

module.exports = {
  id: 'missingDeathSource',
  type: 'source',
  signature: 'personSource',
  help: [],
  check: function(person, sourceRefs) {

    var death = person.$getDeath();

    // If we have no death return
    if(!death) {
      return;
    }

    var year = utils.getFactYear(death),
        place = utils.getFactPlace(death);

    // If we have no year or place
    if(year === undefined || place == undefined) {
      return;
    }

    // See if we have sources tagged for this death
    var sourceArr = sourceRefs.getSourceRefs(),
        tagged = false;
    for(var x in sourceArr) {
      if(sourceArr[x].$getTags().indexOf('http://gedcomx.org/Death') !== -1) {
        tagged = true;
      }
    }

    if(!tagged) {

      var findarecord = {
        tags: ['death'],
        from: (year)? year-3:undefined,
        to: (year)? year+3:undefined,
        place: place
      };
      
      var template = {
        name: person.$getDisplayName(),
        pid:  person.id
      };
  
      return utils.createOpportunity(this, person, template, utils.gensearchPerson(person));

    }
    
  }
};