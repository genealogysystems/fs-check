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

  // If we have an original date without a formal date
  if(marriageFact.$getDate() !== undefined && marriageFact.$getFormalDate() === undefined) {

    return {
      type: 'cleanup',
      title: 'Add a formal marriage date',
      description: 'Go to FamilySearch and enter a formal date for this marriage.',
      person: person,
      findarecord: undefined,
      gensearch: undefined
    };
  }
}