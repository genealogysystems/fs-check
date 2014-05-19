module.exports = function(wife, husband, marriage) {

  var person = wife,
      spouse = husband;
  if(!person) {
    person = husband;
    spouse = undefined;
  }
  if(!person) {
    return;
  }

  var marriageFact = marriage.$getMarriageFact();

  // If we don't have exactly one marriage fact, don't run
  var facts = marriage.$getFacts(),
      count = 0;
  for(var x in facts) {
    if(facts[x].type == 'http://gedcomx.org/Marriage') {
      count++;
    }
  }

  if(count != 1) {
    return;
  }

  // If we have an original place without a normalized place
  if(marriageFact.$getPlace() !== undefined && marriageFact.$getNormalizedPlace() === undefined) {

    return {
      type: 'cleanup',
      title: 'Add a normalized marriage place',
      description: 'Go to FamilySearch and enter a normalized place for this marriage.',
      person: person,
      findarecord: undefined,
      gensearch: undefined
    };
  }
}