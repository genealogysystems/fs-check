/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is a birth date
 *  3. There is a death fact
 *  4. There is a death date
 */
var utils = require('../util.js');

module.exports = function(person) {

  var birth = person.$getBirth();

  // If we don't have a birth
  if(!birth) {
    return;
  }

  // If we don't have a birth date
  if(utils.getFactYear(birth) == undefined) {
    return;
  }

  var death = person.$getDeath();

  // If we don't have a death
  if(!death) {
    return;
  }

  // If we don't have a death date
  if(utils.getFactYear(death) == undefined) {
    return;
  }

  // If death >= birth
  if(utils.getFactYear(death) >= utils.getFactYear(birth)) {
    return;
  }

  var descr = utils.markdown(function(){/*
      Go to [FamilySearch](https://familysearch.org/tree/#view=ancestor&person={{pid}}) and update the person.

      ## Help
  
      * [Correcting information in the Family Tree](https://familysearch.org/ask/productSupport#/Adding-and-Correcting-Information-about-People-and-Relationships)
      * [Explaining approximate birth dates](https://familysearch.org/ask/productSupport#/Do-not-know-exact-birth-date-or-death-date)
    */}, {pid:  person.id});

  var opportunity = {
    type: 'problem',
    title: 'Person Died Before They Were Born',
    description: descr,
    person: person,
    findarecord: undefined,
    gensearch: undefined
  };

  return opportunity;

}