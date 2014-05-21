/**
 * Returns an opportunity if:
 *  1. Person has a birth fact
 *  2. Person has a birth date
 *  3. A Parent has a birth date before Person
 */
var utils = require('../util.js');

module.exports = function(person, parents) {

  var birthBeforeParentBirth = [];

  var birth = person.$getBirth();

  // If we don't have a birth
  if(!birth) {
    return;
  }

  var birthDate = utils.getFactYear(birth)

  // If we don't have a birth date
  if(birthDate == undefined) {
    return;
  }

  for(var x in parents) {
    var parentBirth = parents[x].$getBirth();
    if(parentBirth) {
      var parentBirthDate = utils.getFactYear(parentBirth);
      if(parentBirthDate && parentBirthDate >= birthDate) {
        birthBeforeParentBirth.push({
          id: parents[x].id,
          name: parents[x].$getDisplayName(),
          birth: parents[x].$getDisplayBirthDate()
        });
      }
    } 

  }

  if(birthBeforeParentBirth.length > 0) {

    var descr = utils.markdown(function(){/*
        {{personName}} (Born {{personBirth}}) was born before one or more of their parents.

        {{#parents}}
        * [{{name}}](https://familysearch.org/tree/#view=ancestor&person={{id}}) - {{birth}}
        {{/parents}}

        Go to [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}) and update the person or their parent's birth date(s).

        ## Help
    
        * [Correcting information in the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
        * [Explaining approximate birth dates](https://familysearch.org/ask/productSupport#/Do-not-know-exact-birth-date-or-death-date)
      */}, {
        pid:  person.id,
        personName: person.$getDisplayName(),
        personBirth: person.$getDisplayBirthDate(),
        parents: birthBeforeParentBirth
      });

    var opportunity = {
      type: 'problem',
      title: 'Person Born before their Parent(s)',
      description: descr,
      person: person,
      findarecord: undefined,
      gensearch: undefined
    };

    return opportunity;

  }
}