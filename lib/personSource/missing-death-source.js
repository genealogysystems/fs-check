var utils = require('../util.js');

module.exports = function(person, sourceRefs) {

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
    return {
      type: 'source',
      title: 'Find Sources to support a Death',
      description: 'Search the following collections to find a record of this person\'s death, and add it to FamilySearch',
      person: person,
      findarecord: {
        tags: ['death'],
        from: (year)? year-10:undefined,
        to: (year)? year+10:undefined,
        place: place
      },
      gensearch: {
        givenName: person.$getGivenName(),
        familyName: person.$getSurname(),
        deathPlace: place,
        deathDate: year+'',
      }
    };
  }
  
}