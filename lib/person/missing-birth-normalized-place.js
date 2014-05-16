module.exports = function(person) {

  var birth = person.$getBirth();

  // If we have no birth return
  if(!birth) {
    return;
  }

  // If we have an original place without a normalized place
  if(birth.$getPlace() !== undefined && birth.$getNormalizedPlace() === undefined) {

    return {
      type: 'cleanup',
      title: 'Add a normalized birth place',
      description: 'Go to FamilySearch and enter a normalized place for this birth.',
      person: person,
      findarecord: undefined,
      gensearch: undefined
    };
  }
}