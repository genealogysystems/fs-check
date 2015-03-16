var utils = require('../util.js');

module.exports = {
  id: 'missingBirthSource',
  type: 'source',
  signature: 'personSource',
  help: [],
  check: function(person, sourceRefs) {

    var birth = person.$getBirth();

    // If we have no birth return
    if(!birth) {
      return;
    }

    var year = utils.getFactYear(birth),
        place = utils.getFactPlace(birth);

    // If we have no year or place
    if(year === undefined || place === undefined) {
      return;
    }

    // See if we have sources tagged for this birth
    var sourceArr = sourceRefs.getSourceRefs(),
        tagged = false;
    for(var x in sourceArr) {
      if(sourceArr[x].$getTags().indexOf('http://gedcomx.org/Birth') !== -1) {
        tagged = true;
      }
    }

    if(!tagged) {

      var findarecord = {
        tags: ['birth'],
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