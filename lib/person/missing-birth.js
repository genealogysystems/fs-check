module.exports = function(person) {

  // Return for now.
  return;

  var birth = person.$getBirth();

  if(!birth) {
    return {
      title: 'Find a birth',
      description: 'search far and wide, and you will find a birth',
      person: person,
      findarecord: {},
      gensearch: {}
    };
  } else {
    return;
  }
}