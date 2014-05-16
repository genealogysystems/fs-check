module.exports = function(person) {

  var death = person.$getDeath();

  // If we have no death return
  if(!death) {
    return;
  }

  // If we have an original place without a normalized place
  if(death.$getPlace() !== undefined && death.$getNormalizedPlace() === undefined) {

    return {
      type: 'cleanup',
      title: 'Add a normalized death place',
      description: 'Go to FamilySearch and enter a normalized place for this death.',
      person: person,
      findarecord: undefined,
      gensearch: undefined
    };
  }
}