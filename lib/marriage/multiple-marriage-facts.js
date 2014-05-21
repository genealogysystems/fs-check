/**
 * Returns an opportunity if:
 *  1. There is more than one marriage fact
 */
var utils = require('../util.js');

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

  // If we have more than one marriage fact, don't run
  var facts = marriage.$getFacts(),
      count = 0;
  for(var x in facts) {
    if(facts[x].type == 'http://gedcomx.org/Marriage') {
      count++;
    }
  }

  if(count < 2) {
    return;
  }


  var coupleDescr = '';
  if(wife && husband) {
    coupleDescr = 'between ' + wife.$getDisplayName() + ' and ' + husband.$getDisplayName();
  } else {
    coupleDescr = 'for ' + person.$getDisplayName();
  }

  var descr = utils.markdown(function(){/*
    The marriage {{couple}} has multiple marriage facts associated with it.
    This is unusual, and should be investigated.
    Try to merge like information and reduce them down to 1 marriage fact
    Go to [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}) and correct this problem.

    ## Help

    * [Removing Marriage Facts in the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
  */}, {pid:  person.id, couple: coupleDescr});

  var opportunity = {
    type: 'cleanup',
    title: 'Find a Marriage Date',
    description: descr,
    person: person,
    findarecord: undefined,
    gensearch: undefined
  };

  

  return opportunity;

}