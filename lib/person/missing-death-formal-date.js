module.exports = function(person) {

  var death = person.$getDeath();

  // If we have no death return
  if(!death) {
    return;
  }

  // If we have an original date without a formal date
  if(death.$getDate() !== undefined && death.$getFormalDate() === undefined) {

    return {
      type: 'cleanup',
      title: 'Add a formal death date',
      description: 'Go to FamilySearch and enter a formal date for this death.',
      person: person,
      findarecord: undefined,
      gensearch: undefined
    };
  }
}