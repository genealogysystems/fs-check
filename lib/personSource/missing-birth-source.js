var utils = require('../util.js');

module.exports = function(person, sourceRefs) {

  var birth = person.$getBirth();

  // If we have no birth return
  if(!birth) {
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
    var year = utils.getBirthYear(birth),
        place = utils.getBirthPlace(birth);
    return {
      title: 'Find Sources to support a Birth',
      description: 'Search the following collections to find a record of this person\'s birth, and add it to FamilySearch',
      person: person,
      findarecord: {
        tags: ['birth'],
        from: (year)? year-10:undefined,
        to: (year)? year+10:undefined,
        place: place
      },
      gensearch: {
        givenName: person.$getGivenName(),
        familyName: person.$getSurname(),
        birthPlace: place,
        birthDate: year+'',
      }
    };
  }
  
}