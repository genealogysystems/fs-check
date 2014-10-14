var utils = require('../util.js');

module.exports = {
  id: 'missingBirthSource',
  type: 'source',
  title: 'Find a Birth Record',
  signature: 'personSource',
  check: function(person, sourceRefs) {

    var birth = person.$getBirth();

    // If we have no birth return
    if(!birth) {
      return;
    }

    var year = utils.getFactYear(birth),
        place = utils.getFactPlace(birth);

    // If we have no year or place
    if(year === undefined || place === undefined) {
      return;
    }

    // See if we have sources tagged for this birth
    var sourceArr = sourceRefs.getSourceRefs(),
        tagged = false;
    for(var x in sourceArr) {
      if(sourceArr[x].$getTags().indexOf('http://gedcomx.org/Birth') !== -1) {
        tagged = true;
      }
    }

    if(!tagged) {

      var findarecord = {
        tags: ['birth'],
        from: (year)? year-3:undefined,
        to: (year)? year+3:undefined,
        place: place
      };
    
      var descr = utils.markdown(function(){/*
        Try these steps to find a birth record for [{{name}}](https://familysearch.org/tree/#view=ancestor&person={{pid}}):

        1. Review the [record hints](https://familysearch.org/tree/#view=allMatchingRecords&person={{pid}}) in FamilySearch.
        1. Do broad searches on popular genealogy websites using the links below or using the [RootsSearch](https://chrome.google.com/webstore/detail/rootssearch/aolcffalbhpnojekmimmelebjchjmmgn?hl=en) Chrome Extension.
        1. Ask for help at the [Genealogy and Family History](http://genealogy.stackexchange.com/) Stack Exchange website.
        1. Visit a local [Family History Center](https://familysearch.org/ask/help#localResource).
        1. Hire a researcher from the [Genlighten](http://www.genlighten.com/) community.
        
        We use [tags](https://familysearch.org/ask/salesforce/viewArticle?urlname=Adding-Changing-and-Removing-Tags-from-Sources&lang=en)
        to determine whether a source supports birth information. It is possible that a birth
        source is already attached but not tagged as a birth source.
      */}, {
        pid:  person.id,
        name: person.$getDisplayName()
      });

      return {
        id: this.id + ':' + person.id,
        type: this.type,
        title: this.title,
        description: descr,
        person: person,
        findarecord: findarecord,
        gensearch: utils.gensearchPerson(person)
      };
    }
    
  }
};