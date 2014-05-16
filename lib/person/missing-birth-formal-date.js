module.exports = function(person) {

  var birth = person.$getBirth();

  // If we have no birth return
  if(!birth) {
    return;
  }

  // If we have an original date without a formal date
  if(birth.$getDate() !== undefined && birth.$getFormalDate() === undefined) {

    return {
      type: 'cleanup',
      title: 'Add a formal birth date',
      description: 'Go to FamilySearch and enter a formal date for this birth.',
      person: person,
      findarecord: undefined,
      gensearch: undefined
    };
  }
}