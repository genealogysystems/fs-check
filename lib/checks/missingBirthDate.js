/**
 * Returns an opportunity if:
 *  1. There is a birth fact
 *  2. There is no date
 *  3. There is a place
 */
var utils = require('../util.js');

module.exports = {
  id: 'missingBirthDate',
  type: 'person',
  title: 'Find a Birth Date',
  signature: 'person',
  check: function(person) {

    var birth = person.$getBirth();

    if(!birth) {
      return;
    }

    // If we already have a birth date
    if(utils.getFactYear(birth) !== undefined) {
      return;
    }

    var place = utils.getFactPlace(birth)

    // If we don't have a date AND place, then we count it as not having a birth
    if(place === undefined) {
      return;
    }

    // TODO if they have a christening record, change the description

    var descr = utils.markdown(function(){/*
        Try these steps to find the birth date for [{{name}}](https://familysearch.org/tree/#view=ancestor&person={{pid}}):
        
        1. Review the [record hints](https://familysearch.org/tree/#view=allMatchingRecords&person={{pid}}) in FamilySearch.
        1. Do broad searches on popular genealogy websites using the links below or using the [RootsSearch](https://chrome.google.com/webstore/detail/rootssearch/aolcffalbhpnojekmimmelebjchjmmgn?hl=en) Chrome Extension.
        1. Ask for help at the [Genealogy and Family History](http://genealogy.stackexchange.com/) Stack Exchange website.
        1. Visit a local [Family History Center](https://familysearch.org/ask/help#localResource).
        1. Hire a researcher from the [Genlighten](http://www.genlighten.com/) community.
      */}, {
        name: person.$getDisplayName(),
        pid:  person.id
      });

    return {
      id: this.id + ':' + person.id,
      type: this.type,
      title: this.title,
      description: descr,
      person: person,
      findarecord: undefined,
      gensearch: utils.gensearchPerson(person)
    };
  }
};